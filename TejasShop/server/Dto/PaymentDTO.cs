using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Dto
{
    public class PaymentDTO
    {
        
    }
    public class PaymentVerificationRequest
    {
        public string? OrderId { get; set; }
        public string? PaymentId { get; set; }
        public string? Signature { get; set; }
    }

    public class RetryPaymentVerificationRequest
    {
        public string? OrderId { get; set; }
        public string? PaymentId { get; set; }
        public string? Signature { get; set; }
        public string? Status { get; set; }
        public int RetryCount { get; set; }
    }

    public class UpdatePaymentStatusRequest
    {
        public int OrderId { get; set; }
        public string? Status { get; set; }

    }
}