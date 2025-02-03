using server.Entities;

namespace server.Dto
{
    public class WishListItemResDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public ProductResDto Product { get; set; }
    }
}
