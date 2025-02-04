using Microsoft.AspNetCore.Mvc;
using server.Constants;
using server.Dto;
using server.Interface.Repository;
using server.Interface.Service;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _razorpayService;
    private readonly IPaymentDetailRepository _paymentDetailRepository;

    public PaymentController(IPaymentService razorpayService, IPaymentDetailRepository paymentDetailRepository)
    {
        _razorpayService = razorpayService;
        _paymentDetailRepository = paymentDetailRepository;
    }

    // // Endpoint to create Razorpay order
    // [HttpPost("create-order")]
    // public IActionResult CreateOrder([FromBody] decimal amount)
    // {
    //     var order = _razorpayService.CreateOrder(amount);
    //     return Ok(new { orderId = order.OrderId, amount = order.Amount, currency = order.Currency });
    // }

    // Endpoint to verify Razorpay payment
    // [HttpPost("verify-payment")]
    // public IActionResult VerifyPayment([FromBody] PaymentVerificationRequest verificationRequest)
    // {
    //     var isVerified = _razorpayService.VerifyPaymentSignature(
    //         verificationRequest.OrderId,
    //         verificationRequest.PaymentId,
    //         verificationRequest.Signature
    //     );

    //     return isVerified ? Ok("Payment verified successfully") : BadRequest("Payment verification failed");
    // }

    [HttpPost("update-payment")]
    public async Task<IActionResult> UpdatePayment([FromBody] PaymentVerificationRequest verificationRequest)
    {
        await _razorpayService.VerifyPaymentSignature(
            verificationRequest.OrderId!,
            verificationRequest.PaymentId!,
            verificationRequest.Signature!
        );
        ResponseDto res = new ResponseDto();
        return Ok(res.success(Payment_C.PaymentUpdated));
    }

    [HttpPost("update-Retry-payment-details")]
    public async Task<IActionResult> UpdatePaymentDetails([FromBody] RetryPaymentVerificationRequest retryVerificationRequest)
    {
        await _razorpayService.VerifyPaymentSignature(
            retryVerificationRequest.OrderId!,
            retryVerificationRequest.PaymentId!,
            retryVerificationRequest.Signature!
        );

        // Update the payment status and retry count
        var payment = await _paymentDetailRepository.GetPaymentDetailsByRPId(retryVerificationRequest.OrderId!);
        if (payment == null)
        {
            return NotFound(Payment_C.PaymentDetailsNotFound);
        }

        payment.Status = retryVerificationRequest.Status;
        payment.RetryCount = retryVerificationRequest.RetryCount;

        var updatedPayment = await _paymentDetailRepository.UpdateAsync(payment);
        if (updatedPayment == null)
        {
            return StatusCode(500, Payment_C.FailedToUpdatePaymentStatus);
        }

        ResponseDto res = new ResponseDto();
        return Ok(res.success(Payment_C.PaymentUpdated));
    }
}

public class PaymentVerificationRequest
{
    public string? OrderId { get; set; }
    public string? PaymentId { get; set; }
    public string? Signature { get; set; }
}

public class RetryPaymentVerificationRequest
{
    public string? OrderId { get; set; } // Change this to int
    public string? PaymentId { get; set; }
    public string? Signature { get; set; }
    public string? Status { get; set; }
    public int RetryCount { get; set; }
}
