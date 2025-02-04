using Razorpay.Api;
using server.Constants;

namespace server.Service;
public class RazorpayService
{
    private readonly string _key;
    private readonly string _secret;
    private readonly RazorpayClient _client;

    public RazorpayService(IConfiguration configuration)
    {
        _key = configuration[Payment_C.RazorKeyId];
        _secret = configuration[Payment_C.RazorKeySecret];

        _client = new RazorpayClient(_key, _secret);
    }

    // Verify payment signature from Razorpay
    public bool VerifyPaymentSignature(string orderId, string paymentId, string signature)
    {
        var client = new RazorpayClient(_key, _secret);
        var attributes = new Dictionary<string, string>
        {
            { Payment_C.RazorOrderId, orderId },
            { Payment_C.RazorPaymentId, paymentId },
            { Payment_C.RazorSignature, signature }
        };

        try
        {
            Razorpay.Api.Utils.verifyPaymentSignature(attributes);
            return true;
        }
        catch
        {
            return false;
        }
    }
}

public class PaymentOrder
{
    public string OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
}
