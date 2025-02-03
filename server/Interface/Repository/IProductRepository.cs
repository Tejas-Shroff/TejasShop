using server.Dto;
using server.Entities;

namespace server.Interface.Repository
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product?> GetProductByIdIncludingChlidEntities(int productID);
        Task<List<Product>> GetPaginatedProducts(CatalogSpec spec);
    }
}
