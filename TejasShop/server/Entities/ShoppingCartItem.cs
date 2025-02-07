using System.Text.Json.Serialization;
using server.Constants;

namespace server.Entities
{
    public class ShoppingCartItem
    {
        public int Id { get; set; }
        public int ShoppingCartId { get; set; }
        [JsonIgnore]
        public ShoppingCart? ShoppingCart { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPriceAfterDiscount => Product?.NewPrice * Quantity ?? 0;
        public decimal TotalDiscount => (Product!.OriginalPrice - Product.NewPrice) * Quantity;
        public decimal TotalPrice => Product!.OriginalPrice * Quantity;
        public int MaxAllowedQuantity
        {
            get
            {
                int stockQuantity = Product != null ? Product.StockQuantity : 0;
                return StockQuantityConstants.EvaluateStockQuantity(stockQuantity);
            }
        }

    }

}
