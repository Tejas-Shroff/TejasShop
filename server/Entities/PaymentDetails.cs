
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class PaymentDetails
    {
        public int Id { get; set;}
        public int UserId { get; set; }
        public int OrderId { get; set; }
        public string RazorPayOrderId { get; set; }
        public string? Razorpay_payment_id { get; set; }
        public string? Razorpay_signature{ get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        public string Status { get; set; }
    }
}