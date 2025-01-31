using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Interface.Repository;

namespace server.Repository
{
    public class PaymentDetailRepository : GenericRepository<PaymentDetails>, IPaymentDetailRepository
    {
        private readonly DataContex contex;
        public PaymentDetailRepository(DataContex contex) : base(contex)
        {
            this.contex = contex;
        }

        public async Task<PaymentDetails?> GetPaymentDetailsByOrderId(int orderId)
        {
            return await contex.PaymentDetails.FirstOrDefaultAsync(x => x.OrderId == orderId);
        }

        public async Task<PaymentDetails?> GetPaymentDetailsByRPId(string razorpayOrderId)
        {
            return await contex.PaymentDetails.FirstOrDefaultAsync(x => x.RazorPayOrderId == razorpayOrderId);
        }
        public async Task<PaymentDetails?> UpdatePaymentAsync(PaymentDetails paymentDetails)
        {
            var existingPayment = await contex.Set<PaymentDetails>().FindAsync(paymentDetails.Id);
            if (existingPayment != null)
            {
                existingPayment.Status = paymentDetails.Status;
                existingPayment.RetryCount = paymentDetails.RetryCount;
                contex.Entry(existingPayment).CurrentValues.SetValues(paymentDetails);
                await contex.SaveChangesAsync();
                return existingPayment;
            }
            return null;
        }


    }
}