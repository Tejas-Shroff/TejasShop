using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dto;
using server.Dto.Order;
using server.Entities;
using server.Enum;
using server.Interface.Repository;
using server.Interface.Service;

namespace server.Service
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly ICartService _cartService;
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IPaymentDetailRepository _paymentRepository;
        private readonly IShippingAddressRepository _shippingAddressRepository;
        private readonly IProductRepository _productRepository;
        private readonly DataContex _context;

        public OrderService(
            IMapper mapper,
            ICartService cartService,
            IOrderItemRepository orderItemRepository,
            IOrderRepository orderRepository,
            IPaymentDetailRepository paymentDetailRepository,
            IShippingAddressRepository shippingAddressRepository,
            IProductRepository productRepository,
            DataContex context
        )
        {
            this._mapper = mapper;
            this._cartService = cartService;
            this._orderItemRepository = orderItemRepository;
            this._orderRepository = orderRepository;
            this._paymentRepository = paymentDetailRepository;
            this._shippingAddressRepository = shippingAddressRepository;
            this._productRepository = productRepository;
            this._context = context;
        }
        public async Task<Order> CreateOrderAsync(int userId, int cartId, AddressDto address)
        {
            ShoppingCart? shoppingCart = await _cartService.FindUserCart(userId) ?? throw new Exception(OrderClass.NoCartFoundForUser);
            Order order = new Order()
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                TotalPriceAfterDiscount = shoppingCart.TotalPriceAfterDiscount,
                TotalDiscount = shoppingCart.TotalDiscount,
                TotalPrice = shoppingCart.TotalPrice,
                Status = OrderStatus.Placed.ToString(),
            };
            await _orderRepository.AddAsync(order);
            ShippingAddress shippingAddress = _mapper.Map<ShippingAddress>(address);
            shippingAddress.OrderId = order.Id;
            await _shippingAddressRepository.AddAsync(shippingAddress);
            foreach (var item in shoppingCart.ShoppingCartItems)
            {
                var orderItem = new OrderItem()
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    TotalPriceAfterDiscount = item.TotalPriceAfterDiscount,
                    TotalDiscount = item.TotalDiscount,
                    TotalPrice = item.TotalPrice
                };
                await _orderItemRepository.AddAsync(orderItem);
                // Updating the stock quantity in Product table
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity; // Decreasing stock based on quantity ordered
                    await _productRepository.UpdateAsync(product);
                }
            }
            await _cartService.DeleteCart(cartId);
            return order;
        }

        public async Task<OrderDetailDTO> GetOrderDetailAsync(int orderId, int userId)
        {
            Order order = await _orderRepository.GetByIdAsync(orderId) ?? throw new Exception(OrderClass.InvalidOrderId);
            if (order.UserId != userId) throw new Exception(OrderClass.OrderNotBelong);
            List<OrderItem> orderItems = await _orderItemRepository.GetAllOrderItemByOrderId(orderId);
            order.OrderItems = orderItems;
            ShippingAddress shippingAddress = await _shippingAddressRepository.GetShippingAddressByOrderId(orderId) ?? throw new Exception(OrderClass.NoShippingAddressFound);
            PaymentDetails paymentDetails = await _paymentRepository.GetPaymentDetailsByOrderId(orderId) ?? throw new Exception(OrderClass.NoPaymentFound);
            return new OrderDetailDTO()
            {
                order = _mapper.Map<OrderDto>(order),
                paymentDetails = paymentDetails,
                shippingAddress = shippingAddress
            };
        }

        public async Task<IEnumerable<Order>> GetOrdersAsync(int userId, DateTime? startDate, DateTime? endDate)
        {
            return await _orderRepository.GetAllAsyncByUserId(userId, startDate, endDate);
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return false;
            }

            order.Status = status;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            if (status == OrderStatus.Cancelled.ToString())
            {
                var orderItems = await _context.OrderItems.Where(oi => oi.OrderId == orderId).ToListAsync();
                foreach (var item in orderItems)
                {
                    var product = await _context.products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += item.Quantity;
                        _context.products.Update(product);
                    }
                }
                await _context.SaveChangesAsync();
            }

            return true;
        }
    }
}