using server.Helper;
using server.Interface.Repository;
using server.Interface.Service;
using server.Repository;
using server.Service;

namespace server.Extensions
{
  public static class ApplicationServicesExtension
  {
    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
      //helpers
      services.AddScoped<IJwtHelper, JwtHelper>();
      // Repos
      services.AddScoped<IBrandRepository, BrandRepository>();
      services.AddScoped<ICartItemRepository, CartItemRepository>();
      services.AddScoped<ICartRepository, CartRepository>();
      services.AddScoped<ICategoryRepository, CategoryRepository>();
      services.AddScoped<IImageRepository, ImageRepository>();
      services.AddScoped<IOrderItemRepository, OrderItemRepository>();
      services.AddScoped<IOrderRepository, OrderRepository>();
      services.AddScoped<IShippingAddressRepository, ShippingAddressRepository>();
      services.AddScoped<IPaymentDetailRepository, PaymentDetailRepository>();
      services.AddScoped<IProductRepository, ProductRepository>();
      services.AddScoped<IUserRepository, UserRepository>();
      services.AddScoped<IWishListItemRepository, WishListItemRepository>();
      services.AddScoped<IWishListRepository, WishListRepository>();
      // Services 
      services.AddScoped<ICartService, CartService>();
      services.AddScoped<ICatalogService, CatalogService>();
      services.AddScoped<IImageService, ImageService>();
      services.AddScoped<IOrderService, OrderService>();
      services.AddScoped<IPaymentService, PaymentService>();
      services.AddScoped<IWishListService, WishListService>();
      return services;
    }
  }
}