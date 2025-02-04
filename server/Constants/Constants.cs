

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
        public const string StockQtyUpdatedSuccessfully = "Stock quantities updated successfully.";
        public const string ErrorOccurred = "An error occurred: {0}";
        public const string InvalidProductId = "Invalid Product Id {0}";
    }
    public class Image_C
    {

        public const string FileNotFound = "File is empty";
        public const string Uploads = "Uploads";
        public const string NoImageFound = "No Image found with id ";

    }
    public class Cart
    {
        public const string Successfull = "Successfull";
        public const string SucessfullyAddedToCart = "SuccessFully Added To Cart";
        public const string ProductNotFound = "Product Not Found.";
        public const string MaxQuantityExceeded = "You can only add a maximum of {0} quantities per item.";
        public const string NoCartFound = "No Cart Found";
        public const string ItemNotFound = "Item not found.";
        public const string CartNotFound = "Error Cart not found";
        public const string UnauthorizedItemRemoval = "You can't remove another user's item";
        public const string UnauthorizedItemUpdate = "You can't update another user's cart item";

    }

    public class Wishlist_C
    {
        public const string ProductNotFound = "Product not found.";
        public const string WishlistNotFound = "Wishlist not found.";
        public const string ProductNotFoundInWishList = "Product not found in wishlist.";
        public const string AddedToWishlist = "Product added to wishlist.";
        public const string RemovedFromWishlist = "Product removed from wishlist.";
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
        public const string NoCartFoundForUser = "no cart found for user";
        public const string InvalidOrderId = "Invalid Order ID";
        public const string OrderNotBelong = "Order do not belongs to you";
        public const string NoShippingAddressFound = "No Shipping Address found for Order ID";
        public const string NoPaymentFound = "No payment found for Order ID";

    }

    public class Payment_C
    {
        public const string PaymentDetailsNotFound = "Payment details not found";
        public const string FailedToUpdatePaymentStatus = "Failed to update payment status";
        public const string PaymentUpdated = "Payment Updated";
        public const string RazorKeySecret = "Razorpay:KeySecret";
        public const string RazorKeyId = "Razorpay:KeyId";

        public const string Amount = "amount";
        public const string Receipt = "receipt";
        public const string rec_ = "rec_";
        public const string Currency = "currency";
        public const string Currency_S = "INR";
        public const string OrderID = "id";
        public const string RazorOrderId = "razorpay_order_id";
        public const string RazorPaymentId = "razorpay_payment_id";
        public const string RazorSignature = "razorpay_signature";
        public const string StatusPendingCOD = "Pending - Cash on Delivery";
        public const string UpdateFailed = "Failed to update payment details";
        public const string UpdateSuccess = "Payment details updated successfully";
    }

    public class UserClass
    {
        public const string Success = "Success";
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
    public static class StockQuantityConstants
    {
        public static readonly Func<int, int> EvaluateStockQuantity = stockQuantity => stockQuantity switch
        {
            <= 10 => 1,
            <= 20 => 2,
            <= 50 => 3,
            <= 500 => 4,
            _ => 5
        };
    }
    public enum OrderStatus
    {

        Placed,        // 0
        Confirmed,
        Shipped,
        OutForDelivery,     // 2
        Delivered,      // 3
        Cancelled,      // 4
        Returned,       // 5
        Failed          // 
    }
     public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Refund
    }
}

