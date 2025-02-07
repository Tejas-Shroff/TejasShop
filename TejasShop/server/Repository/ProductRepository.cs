using Microsoft.EntityFrameworkCore;
using server.Constants;
using server.Data;
using server.Dto;
using server.Entities;
using server.Interface.Repository;

namespace server.Repository
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly DataContex contex;

        public ProductRepository(DataContex contex) : base(contex)
        {
            this.contex = contex;
        }

        public async Task<Product?> GetProductByIdIncludingChlidEntities(int productID)
        {
            return await contex.products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Thumbnail)
                .Where(p => p.Id == productID)
                .SingleOrDefaultAsync();
        }

        public async Task<List<Product>> GetPaginatedProducts(CatalogSpec spec)
        {
            var query = contex.products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.Thumbnail)
                .AsQueryable();

            if (spec.BrandIds != null && spec.BrandIds.Any())
            {
                query = query.Where(p => spec.BrandIds.Contains(p.BrandId));
            }

            if (spec.CategoryIds != null && spec.CategoryIds.Any())
            {
                query = query.Where(p => spec.CategoryIds.Contains(p.CategoryId));
            }

            if (!string.IsNullOrEmpty(spec.Search))
            {
                query = query.Where(p => (!string.IsNullOrEmpty(p.Name) && p.Name.Contains(spec.Search)) ||
                                         (!string.IsNullOrEmpty(p.Description) && p.Description.Contains(spec.Search)));
            }

            var filteredQuery = await query.ToListAsync();

            if (spec.InStock.HasValue)
            {
                filteredQuery = [.. filteredQuery.Where(p => p.InStock == spec.InStock.Value)];
            }

            filteredQuery = spec.sortBy switch
            {
                ProductPrice.Sort_LowToHigh_Price => [.. filteredQuery.OrderBy(p =>
                    p.OriginalPrice - (p.DiscountPercentage.HasValue ? (p.OriginalPrice * p.DiscountPercentage.Value / 100) : 0))],
                ProductPrice.Sort_HighToLow_Price => [.. filteredQuery.OrderByDescending(p =>
                    p.OriginalPrice - (p.DiscountPercentage.HasValue ? (p.OriginalPrice * p.DiscountPercentage.Value / 100) : 0))],
                _ => filteredQuery
            };

            return filteredQuery;
        }
    }
}