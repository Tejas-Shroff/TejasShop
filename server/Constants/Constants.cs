

namespace server.Constants
{
    public class UserId
    {
        public const string userId = "UserId";
    }

    public class Auth
    {
        public const string InvalidRequest = "Invalid Request";
        public const string InvalidUserName = "Invalid Username!";
        public const string InvalidPassword = "Invalid Password!";
        public const string InternalServerError = "Internal Server Error";
        public const string UserAlreadyExists = "User with email {0} already exists!";
        public const string RegisteredSuccessfully = "User registered successfully";
        public const string LoggedOut = "User Successfully logout";
    }

    public class Catalog_C
    {
        public const string InvalidCategoryId = "Invalid Category Id {0}";
        public const string InvalidBrandId = "Invalid Brand Id {0}";
        public const string ProductNotFound = "Product with ID {0} not found.";
        public const string SomeProductsNotFound = "Some products were not found.";
        public const string InsufficientStock = "Insufficient stock for product ID: {0}";
        public const string StockUpdatedSuccessfully = "Stock quantities updated successfully.";
        public const string ErrorOccurred = "An error occurred: {0}";
    }
    public class Cart
    {
        public const string Successfull = "Successfull";
        public const string SucessfullyAddedToCart = "SuccessFully Added To Cart";

        public const string ProductNotFound = "Product Not Found.";
        public const string MaxQuantityExceeded = "You can only add a maximum of 3 quantities per item.";
        public const string NoCartFound = "No Cart Found";
        public const string ItemNotFound = "Item not found.";
        public const string CartNotFound = "Error Cart not found";
        public const string UnauthorizedItemRemoval = "You can't remove another user's item";
        public const string UnauthorizedItemUpdate = "You can't update another user's cart item";

    }

    public class CartItem
    {
        public const string ItemRemovedSuccessfully = "Item Removed Successfully";
    }
    public class OrderClass
    {
        public const string OrderSuccessfullyCreated = "Order Created Successfully";
        public const string OrderStatusSuccessfullyUpdated = "Order status updated Successfully";
        public const string FailedToUpdateOrderStatus = "Failed to update order status";

    }

    public class Payment
    {
        public const string PaymentDetailsNotFound = "Payment details not found";
        public const string FailedToUpdatePaymentStatus = "Failed to update payment status";
        public const string PaymentUpdated = "Payment Updated";

    }

    public class UserClass
    {
        public const string Success = "Success";
    }
    public class Wishlist
    {
        public const string AddedToWishlist = "Product added to wishlist.";
        public const string RemovedFromWishlist = "Product removed from wishlist.";
    }
    public class JwtClass
    {
        public const string InvalidToken = "Invalid Token!";
        public const string KeyMissing = "Jwt key is missing";
        public const string JwtIssuer = "Jwt:Issuer";
        public const string JwtKey = "Jwt:Key";
        public const string swaggerJwtDescription = "JWT Authorization header using the Bearer scheme.";
    }

    public class ProductPrice
    {
        public const string Sort_HighToLow_Price = "price_htl";
        public const string Sort_LowToHigh_Price = "price_lth";
    }
}

