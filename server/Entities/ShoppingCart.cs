namespace server.Entities
{
    public class ShoppingCart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public ICollection<ShoppingCartItem>? ShoppingCartItems { get; set; }

        public decimal TotalPriceAfterDiscount =>
                // Sum the price of all items in the cart
                ShoppingCartItems?.Sum(item => item.TotalPriceAfterDiscount) ?? 0;
        public decimal TotalDiscount =>
                // Sum the price of all items in the cart
                ShoppingCartItems?.Sum(item => item.TotalDiscount) ?? 0;
        public decimal TotalPrice =>

                ShoppingCartItems?.Sum(item => item.TotalPrice) ?? 0; // Sum the price of all items in the cart
                                                                
        public int TotalItems => // A property to track the total number of items in the cart
                ShoppingCartItems?.Sum(item => item.Quantity) ?? 0;
                
    }
}
