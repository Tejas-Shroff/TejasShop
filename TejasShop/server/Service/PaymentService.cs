using Razorpay.Api;
using server.Constants;
using server.Data;
using server.Entities;
using server.Interface.Repository;
using server.Interface.Service;

namespace server.Service
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;
        private readonly IPaymentDetailRepository _paymentDetailRepository;
        private readonly DataContex contex;

        public PaymentService(IConfiguration config, IPaymentDetailRepository paymentDetailRepository, DataContex contex)
        {
            this._config = config;
            this._paymentDetailRepository = paymentDetailRepository;
            this.contex = contex;
        }
        public async Task<PaymentDetails> InitializePayment(int userId, int orderId, decimal amount, string currency = Payment_C.Currency_S)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(_config[Payment_C.RazorKeyId], _config[Payment_C.RazorKeySecret]); //Initializes Razorpay client with API keys.
                string reciept = Payment_C.rec_ + userId + "_" + amount + "_" + new Random().Next(1000, 10000); // this will generate the unique receiptt Id.

                Dictionary<string, object> options = new Dictionary<string, object>();  // this will set the order option including follwing params.
                options.Add(Payment_C.Amount, amount * 100); // amount in the smallest currency unit
                options.Add(Payment_C.Receipt, reciept);
                options.Add(Payment_C.Currency, currency);
                Razorpay.Api.Order order = client.Order.Create(options); // creates the order with razorpay Id.
                string razorpayOrderId = order[Payment_C.OrderID];  // this will retrieve the order id.
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
            catch (Exception)
            {
                throw;
            }
        }



        // public async Task VerifyPaymentSignature(string orderId, string paymentId, string signature)
        // {
        //     RazorpayClient client = new RazorpayClient(_config[Payment_C.RazorKeyId], _config[Payment_C.RazorKeySecret]);

        //     var attributes = new Dictionary<string, string>
        //     {
        //         { Payment_C.RazorOrderId, orderId },
        //         { Payment_C.RazorPaymentId, paymentId },
        //         { Payment_C.RazorSignature, signature }
        //     };

        //     PaymentDetails payment = await _paymentDetailRepository.GetPaymentDetailsByRPId(orderId) ?? throw new Exception("no payment found");
        //     payment.Razorpay_payment_id = paymentId;
        //     payment.Razorpay_signature = signature;

        //     try
        //     {
        //         Razorpay.Api.Utils.verifyPaymentSignature(attributes);
        //         payment.Status = PaymentStatus.Completed.ToString();
        //     }
        //     catch
        //     {
        //         // Only increment retry count and update status if the current status is not Completed
        //         if (payment.Status != PaymentStatus.Completed.ToString())
        //         {
        //             payment.Status = PaymentStatus.Failed.ToString();
        //             payment.RetryCount++;

        //             if (payment.RetryCount >= 2)
        //             {
        //                 payment.Status = Payment_C.StatusPendingCOD;
        //             }

        //         }
        //     }

        //     var res = await _paymentDetailRepository.UpdateAsync(payment);
        //     if (res == null)
        //     {
        //         throw new Exception(Payment_C.UpdateFailed);
        //     }
        //     else
        //     {
        //         Console.WriteLine(Payment_C.UpdateSuccess);
        //     }

        //     var order = await contex.Orders.FindAsync(payment.OrderId);
        //     if (order != null && order.Status == OrderStatus.Cancelled.ToString() && payment.Status == PaymentStatus.Completed.ToString())
        //     {
        //         payment.Status = Payment_C.StatusRefundInitiated;
        //         await _paymentDetailRepository.UpdateAsync(payment);
        //     }
        // }


        public async Task VerifyPaymentSignature(string orderId, string paymentId, string signature)
        {
            RazorpayClient client = new RazorpayClient(_config[Payment_C.RazorKeyId], _config[Payment_C.RazorKeySecret]);

            var attributes = new Dictionary<string, string>
            {
                { Payment_C.RazorOrderId, orderId },
                { Payment_C.RazorPaymentId, paymentId },
                { Payment_C.RazorSignature, signature }
                };

            // Fetch payment details
            PaymentDetails payment = await _paymentDetailRepository.GetPaymentDetailsByRPId(orderId) ?? throw new Exception("no payment found");
            payment.Razorpay_payment_id = paymentId;
            payment.Razorpay_signature = signature;

            // Fetch order details using the provided context
            var order = await contex.Orders.FindAsync(payment.OrderId);
            if (order == null)
            {
                throw new Exception("no order found");
            }

            try
            {
                Razorpay.Api.Utils.verifyPaymentSignature(attributes);
                payment.Status = PaymentStatus.Completed.ToString();

                // Update payment status based on order status and payment conditions
                if (order.Status == "confirmed")
                {
                    if (payment.Status == "Pending")
                        payment.Status = "Payment Pending";
                    else if (payment.Status == "Completed")
                        payment.Status = "Payment Completed";
                    else if (payment.Status == "Pending - Cash on Delivery")
                        payment.Status = "Payment - Cash on Delivery";
                }
                else if (order.Status == "cancelled")
                {
                    if (payment.Status == "Pending")
                        payment.Status = "Refund Not Applicable";
                    else if (payment.Status == "Completed")
                        payment.Status = "Refund Initiated";
                    else if (payment.Status == "Pending - Cash on Delivery")
                        payment.Status = "Refund Not Applicable";
                }
            }
            catch
            {
                // Only increment retry count and update status if the current status is not Completed
                if (payment.Status != PaymentStatus.Completed.ToString())
                {
                    payment.Status = PaymentStatus.Failed.ToString();
                    payment.RetryCount++;

                    if (payment.RetryCount >= 2)
                    {
                        payment.Status = Payment_C.StatusPendingCOD;
                    }
                }
            }

            // Ensure status is updated correctly after retries
            if (order.Status == "cancelled" && payment.Status == Payment_C.StatusPendingCOD)
            {
                payment.Status = "Refund Not Applicable";
            }

            var res = await _paymentDetailRepository.UpdateAsync(payment);
            if (res == null)
            {
                throw new Exception(Payment_C.UpdateFailed);
            }
            else
            {
                Console.WriteLine(Payment_C.UpdateSuccess);
            }
        }



    }
}