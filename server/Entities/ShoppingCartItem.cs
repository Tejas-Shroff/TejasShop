using System.Text.Json.Serialization;

namespace server.Entities
{
    public class ShoppingCartItem
    {
        public int Id { get; set; }
        public int ShoppingCartId { get; set; }
        [JsonIgnore]
        public ShoppingCart ShoppingCart { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }

        public decimal TotalPriceAfterDiscount
        {
            get
            {
                return Product.NewPrice * Quantity;
            }
        }

        public decimal TotalDiscount
        {
            get
            {
                return (Product.OriginalPrice - Product.NewPrice) * Quantity;
            }
        }

        public decimal TotalPrice
        {
            get
            {
                return Product.OriginalPrice * Quantity;
            }
        }
        public int MaxAllowedQuantity
        {
            get
            {
                int stockQuantity = Product != null ? Product.StockQuantity : 0;
                return GetMaxAllowedQuantity(stockQuantity);
            }
        }
        private int GetMaxAllowedQuantity(int stockQuantity)
        {
            if (stockQuantity <= 10)
                return 1;
            else if (stockQuantity <= 20)
                return 2;
            else if (stockQuantity <= 50)
                return 3;
            else if (stockQuantity <= 500)
                return 4;
            else
                return 5;
        }
    }

}
