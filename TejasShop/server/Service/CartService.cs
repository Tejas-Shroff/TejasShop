using server.Dto;
using server.Entities;
using server.Interface.Repository;
using server.Interface.Service;
using server.Constants;

namespace server.Service
{
    public class CartService : ICartService
    {
        private readonly ICartRepository cartRepository;
        private readonly ICartItemRepository cartItemRepository;
        private readonly IProductRepository productRepository;

        public CartService(
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            IProductRepository productRepository
        )
        {
            this.cartRepository = cartRepository;
            this.cartItemRepository = cartItemRepository;
            this.productRepository = productRepository;
        }

        private int GetMaxAllowedQuantity(int stockQuantity)
        {
            return StockQuantityConstants.EvaluateStockQuantity(stockQuantity);
        }

        public async Task<ResponseDto> AddItemToCart(int userId, int productId, int quantity)
        {
            ShoppingCart cart = await cartRepository.FindCartByUserId(userId) ?? new ShoppingCart();
            if (cart == null)
            {
                cart = new ShoppingCart()
                {
                    UserId = userId,
                    ShoppingCartItems = []  // collection initilaization
                };
                await cartRepository.AddAsync(cart);
            }

            var product = await productRepository.GetByIdAsync(productId);
            if (product is null)
            {
                return new ResponseDto { IsSuccessed = false, Message = Cart.ProductNotFound };
            }

            int stockQuantity = product.StockQuantity;
            int maxAllowedQuantity = GetMaxAllowedQuantity(stockQuantity);

            List<ShoppingCartItem> cartItems = await cartItemRepository.GetAllByCartId(cart.Id);
            ShoppingCartItem? item = cartItems.FirstOrDefault(x => x.ProductId == productId);

            int currentQuantity = item != null ? item.Quantity : 0;

            if (currentQuantity + quantity > maxAllowedQuantity)
            {
                return new ResponseDto
                {
                    IsSuccessed = false,
                    Message = string.Format(Cart.MaxQuantityExceeded, maxAllowedQuantity)
                };
            }

            if (item == null)
            {
                item = new ShoppingCartItem()
                {
                    ShoppingCartId = cart.Id,
                    ProductId = productId,
                    Quantity = quantity
                };
                await cartItemRepository.AddAsync(item);
            }
            else
            {
                item.Quantity += quantity;
                await cartItemRepository.UpdateAsync(item);
            }

            return new ResponseDto { IsSuccessed = true };
        }
        public async Task UpdateCartItem(int userId, int cartItemId, int quantity)
        {
            ShoppingCartItem shoppingCartItem = await cartItemRepository.GetByIdAsync(cartItemId)
                ?? throw new Exception(Cart.ItemNotFound);

            ShoppingCart cart = await cartRepository.GetByIdAsync(shoppingCartItem.ShoppingCartId)
                ?? throw new Exception(Cart.CartNotFound);

            if (cart.UserId != userId)
            {
                throw new Exception(Cart.UnauthorizedItemUpdate);
            }

            var product = await productRepository.GetByIdAsync(shoppingCartItem.ProductId)
                ?? throw new Exception(Cart.ProductNotFound);

            int stockQuantity = product.StockQuantity;
            int maxAllowedQuantity = GetMaxAllowedQuantity(stockQuantity);

            if (quantity > maxAllowedQuantity)
            {
                throw new Exception(string.Format(Cart.MaxQuantityExceeded, maxAllowedQuantity));
            }

            if (quantity <= 0)
            {
                await cartItemRepository.DeleteAsync(shoppingCartItem);
                return;
            }

            shoppingCartItem.Quantity = quantity;
            await cartItemRepository.UpdateAsync(shoppingCartItem);
        }

        public async Task DeleteCart(int cartId)
        {
            List<ShoppingCartItem> cartItems = await cartItemRepository.GetAllByCartId(cartId);
            foreach (var item in cartItems)
            {
                await cartItemRepository.DeleteAsync(item);
            }

        }

        public Task<ShoppingCartItem?> FindCartItemById(int cartItemId)
        {
            throw new NotImplementedException();
        }

        public async Task<ShoppingCart?> FindUserCart(int userId)
        {
            var cart = await cartRepository.FindCartByUserId(userId);
            if (cart == null)
            {
                throw new Exception(Cart.NoCartFound);
            }
            List<ShoppingCartItem> cartItems = await cartItemRepository.GetAllByCartId(cart.Id);
            cart.ShoppingCartItems = cartItems;
            return cart;
        }

        public async Task RemoveCartItem(int userId, int cartItemId)
        {
            ShoppingCartItem shoppingCartItem = await cartItemRepository.GetByIdAsync(cartItemId)
            ?? throw new Exception(Cart.ItemNotFound);

            ShoppingCart cart = await cartRepository.GetByIdAsync(shoppingCartItem.ShoppingCartId)
            ?? throw new Exception(Cart.CartNotFound);
            if (cart.UserId != userId)
            {
                throw new Exception(Cart.UnauthorizedItemRemoval);
            }
            await cartItemRepository.DeleteAsync(shoppingCartItem);
        }

    }
}