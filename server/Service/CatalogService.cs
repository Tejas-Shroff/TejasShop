using AutoMapper;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.Interface.Repository;
using server.Interface.Service;

namespace server.Service
{
    public class CatalogService : ICatalogService
    {
        private readonly IProductRepository productRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IBrandRepository brandRepository;
        private readonly IImageService imageService;
        private readonly IMapper mapper;
        private readonly DataContex contex;

        public CatalogService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IBrandRepository brandRepository,
            IImageService imageService,
            IMapper mapper,
            DataContex context)
        {
            this.productRepository = productRepository;
            this.categoryRepository = categoryRepository;
            this.brandRepository = brandRepository;
            this.imageService = imageService;
            this.mapper = mapper;
            this.contex = context;
        }

        public async Task<Brand> CreateBrand(CreateBrandReq inData)
        {
            Image image = await this.imageService.SaveImageAsync(inData.Image);
            Brand brand = mapper.Map<Brand>(inData);
            brand.ImageId = image.Id;
            return await brandRepository.AddAsync(brand);

        }

        public async Task<Category> CreateCategery(CreateCategoryReq inData)
        {
            Image image = await this.imageService.SaveImageAsync(inData.Image);

            Category category = mapper.Map<Category>(inData);
            category.Image = image;
            return await categoryRepository.AddAsync(category);
        }

        public async Task<Product> CreateProduct(CreateProductReq inData)
        {
            Category? category = await this.categoryRepository.GetByIdAsync(inData.CategoryId);
            Brand? brand = await this.brandRepository.GetByIdAsync(inData.BrandId);

            if (category == null) { throw new Exception($"Invalid Category Id {inData.CategoryId}"); }
            ;
            if (brand == null) { throw new Exception($"Invalid Brand Id {inData.BrandId}"); }
            ;

            Image image = await this.imageService.SaveImageAsync(inData.Thumbnail);

            Product newProduct = mapper.Map<Product>(inData);

            newProduct.Brand = brand;
            newProduct.Category = category;
            newProduct.Thumbnail = image;

            return await this.productRepository.AddAsync(newProduct);
        }
        public async Task<Product> UpdateProduct(int productId, UpdateProductReq updatedProduct)
        {
            Product? existingProduct = await GetProductById(productId);
            if (existingProduct == null)
            {
                throw new Exception($"Product with ID {productId} not found.");
            }

            existingProduct.Name = updatedProduct.Name;
            existingProduct.Description = updatedProduct.Description;
            existingProduct.OriginalPrice = updatedProduct.OriginalPrice;
            existingProduct.DiscountPercentage = updatedProduct.DiscountPercentage;
            existingProduct.StockQuantity = updatedProduct.StockQuantity;
            existingProduct.CategoryId = updatedProduct.CategoryId;
            existingProduct.BrandId = updatedProduct.BrandId;

            if (updatedProduct.Thumbnail != null)
            {
                Image newImage = await imageService.SaveImageAsync(updatedProduct.Thumbnail);
                existingProduct.Thumbnail = newImage;
            }

            await productRepository.UpdateAsync(existingProduct);

            return existingProduct;
        }

        public async Task DeleteBrand(int brandId)
        {
            Brand? brand = await this.brandRepository.GetByIdAsync(brandId);
            if (brand == null) { throw new Exception($"Invalid Brand Id {brandId}"); }
            ;

            if (brand.ImageId != null)
            {
                await imageService.DeleteImageAsync((int)brand.ImageId);
            }

            await brandRepository.DeleteAsync(brand);
        }

        public async Task DeleteCategery(int categeryId)
        {
            Category? category = await this.categoryRepository.GetByIdAsync(categeryId);
            if (category == null) { throw new Exception($"Invalid Category Id {categeryId}"); }
            ;

            if (category.ImageId != null)
            {
                await imageService.DeleteImageAsync((int)category.ImageId);
            }
            await categoryRepository.DeleteAsync(category);

        }

        public async Task DeleteProduct(int productId)
        {
            Product? product = await productRepository.GetByIdAsync(productId);
            if (product == null) { throw new Exception($"Invalid Product Id {productId}"); }
            ;

            if (product.ThumbnailId != null)
            {
                await imageService.DeleteImageAsync((int)product.ThumbnailId);
            }

            await productRepository.DeleteAsync(product);
        }

        public async Task<ResponseDto> UpdateProductStock(UpdateStockReq updateStockDto)
        {
            ResponseDto response = new ResponseDto();
            try
            {
                var productIds = updateStockDto.Products.Select(p => p.ProductId).ToList();
                var products = await contex.products.Where(p => productIds.Contains(p.Id)).ToListAsync();

                if (products.Count != updateStockDto.Products.Count)
                {
                    response.IsSuccessed = false;
                    response.Message = "Some products were not found.";
                    return response;
                }

                foreach (var productUpdate in updateStockDto.Products)
                {
                    var product = products.FirstOrDefault(p => p.Id == productUpdate.ProductId);
                    if (product == null) continue;

                    if (product.StockQuantity < productUpdate.QuantityOrdered)
                    {
                        response.IsSuccessed = false;
                        response.Message = $"Insufficient stock for product ID: {product.Id}";
                        return response;
                    }
                    product.StockQuantity -= productUpdate.QuantityOrdered;
                }

                await contex.SaveChangesAsync();
                response.IsSuccessed = true;
                response.Message = "Stock quantities updated successfully.";
                return response;
            }
            catch (Exception ex)
            {
                response.IsSuccessed = false;
                response.Message = $"An error occurred: {ex.Message}";
                return response;
            }
        }

        public async Task<IEnumerable<Brand>> GetAllBrand()
        {
            return await brandRepository.GetAllIncludingImage();
        }

        public async Task<IEnumerable<Category>> GetAllCategery()
        {
            return await categoryRepository.GetAllIncludingImage();
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await productRepository.GetProductByIdIncludingChlidEntities(id);
        }
    }
}
