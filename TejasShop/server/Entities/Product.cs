namespace server.Entities
{
    public class Product : AuditBaseEntity
    {

        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }

        public decimal? DiscountPercentage { get; set; }

        public decimal NewPrice
        {
            get
            {
                if (DiscountPercentage.HasValue && DiscountPercentage.Value > 0) // Apply percentage discount if available
                {
                    return OriginalPrice - (OriginalPrice * DiscountPercentage.Value / 100);
                }

                return OriginalPrice; // If no discount, return the original price
            }
        }

        public bool IsOnDiscount
        {
            get
            {
                return DiscountPercentage.HasValue && DiscountPercentage.Value > 0;
            }
        }

        public int StockQuantity { get; set; }
        public bool InStock
        {
            get { return StockQuantity > 0 ? true : false; }
        }

        public bool IsFeatured { get; set; } = false;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int BrandId { get; set; }
        public Brand? Brand { get; set; }

        public int? ThumbnailId { get; set; }
        public Image? Thumbnail { get; set; }
    }
}
