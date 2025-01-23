using Razorpay.Api;
using server.Entities;
using server.Enum;
using server.Interface.Repository;
using server.Interface.Service;

namespace server.Service
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;
        private readonly IPaymentDetailRepository _paymentDetailRepository;

        public PaymentService(IConfiguration config, IPaymentDetailRepository paymentDetailRepository)
        {
            this._config = config;
            this._paymentDetailRepository = paymentDetailRepository;
        }
        public async Task<PaymentDetails> InitializePayment(int userId, int orderId, decimal amount, string currency = "INR")
        {
            try
            {
                RazorpayClient client = new RazorpayClient(_config["Razorpay:KeyId"], _config["Razorpay:KeySecret"]); //Initializes Razorpay client with API keys.
                string reciept = "rec_" + userId + "_" + amount + "_" + new Random().Next(1000, 10000); // this will generate the unique receiptt Id.

                Dictionary<string, object> options = new Dictionary<string, object>();  // this will set the order option including follwing params.
                options.Add("amount", amount * 100); // amount in the smallest currency unit
                options.Add("receipt", reciept);
                options.Add("currency", currency);
                Razorpay.Api.Order order = client.Order.Create(options); // creates the order with razorpay Id.
                string razorpayOrderId = order["id"];  // this will retrieve the order id.
                //save in db for reference. Implementation below.
                return await _paymentDetailRepository.AddAsync(   // Adding it to databasee.
                     new PaymentDetails()
                     {
                         UserId = userId,
                         OrderId = orderId,
                         Amount = amount,
                         RazorPayOrderId = razorpayOrderId,
                         Status = PaymentStatus.Pending.ToString(),
                     }
                 );
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task VerifyPaymentSignature(string orderId, string paymentId, string signature)
        {
            RazorpayClient client = new RazorpayClient(_config["Razorpay:KeyId"], _config["Razorpay:KeySecret"]);

            var attributes = new Dictionary<string, string>
            {
                { "razorpay_order_id", orderId },
                { "razorpay_payment_id", paymentId },
                { "razorpay_signature", signature }
            };
            PaymentDetails payment = await _paymentDetailRepository.GetPaymentDetailsByRPId(orderId) ?? throw new Exception("no payment found");
            payment.Razorpay_payment_id = paymentId;
            payment.Razorpay_signature = signature;   // Getting the payment details from the database.
            try
            {
                Razorpay.Api.Utils.verifyPaymentSignature(attributes);  // this verifies the payment signature.

                payment.Status = PaymentStatus.Completed.ToString();
            }
            catch
            {
                payment.Status = PaymentStatus.Failed.ToString();
            }
           var res= await _paymentDetailRepository.UpdateAsync(payment);   // updates the payment status based on result.
        }
    }
}