

using server.Constants;

namespace server.Extensions
{
    public static class SwaggerServiceExtension
    {
        public static IServiceCollection AddSwaggerDoc(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition(Jwt_Swagger_Ext.Bearer, new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = Jwt_Swagger_Ext.Authorization,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = Jwt_Swagger_Ext.Bearer,
                    BearerFormat = Jwt_Swagger_Ext.JWT,
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = JwtClass.swaggerJwtDescription
                });
                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement {
                {
                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = Jwt_Swagger_Ext.Bearer
                            }
                        },
                        new string[] {}
                }
            });
            });
            return services;
        }
    }
}