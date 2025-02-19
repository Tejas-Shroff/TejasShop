﻿using server.Entities;

namespace server.Dto
{
    public class CreateProductReq
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal? DiscountAmount { get; set; }
        public int StockQuantity { get; set; }
        public bool IsFeatured { get; set; } = false;
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public IFormFile? Thumbnail { get; set; }
    }

    public class CreateBrandReq
    {
        public string? Name { get; set; }
        public IFormFile? Image { get; set; }

    }

    public class CreateCategoryReq
    {
        public string? Name { get; set; }
        public IFormFile? Image { get; set; }
    }
    public class CatalogSpec // for filters
    {
        public int[]? BrandIds { get; set; }
        public int[]? CategoryIds { get; set; }
        public string? Search { get; set; }
        public bool? InStock { get; set; }
        public string? sortBy { get; set; }
    }

    public class CategoryResDto   // for category reponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public ImageDtoRes? Image { get; set; }
    }

    public class BrandResDto  // for brand response
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public ImageDtoRes? Image { get; set; }
    }
    public class ProductResDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal NewPrice { get; set; }
        public bool IsOnDiscount { get; set; }
        public int StockQuantity { get; set; }
        public bool InStock { get; set; }
        public bool IsFeatured { get; set; } = false;

        public CategoryResDto? Category { get; set; }

        public BrandResDto? Brand { get; set; }
        public ImageDtoRes? Thumbnail { get; set; }
    }

    public class UpdateProductReq
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal OriginalPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public IFormFile? Thumbnail { get; set; }
    }

    public class UpdateStockReq
    {
        public List<ProductStockUpdate>? Products { get; set; }
    }
    public class ProductStockUpdate
    {
        public int ProductId { get; set; }
        public int QuantityOrdered { get; set; }
    }
}
