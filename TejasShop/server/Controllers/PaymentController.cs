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
    public async Task<IActionResult> UpdateRetryPaymentDetails([FromBody] RetryPaymentVerificationRequest retryVerificationRequest)
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

    [HttpPost("update-payment-status")]
    public async Task<IActionResult> UpdatePaymentStatus([FromBody] UpdatePaymentStatusRequest updateRequest)
    {
        // Fetch payment details by order Id
        var payment = await _paymentDetailRepository.GetPaymentDetailsByOrderId(updateRequest.OrderId);
        if (payment == null)
        {
            return NotFound(Payment_C.PaymentDetailsNotFound);
        }
        payment.Status = updateRequest.Status;
        var updatedPayment = await _paymentDetailRepository.UpdateAsync(payment);
        if (updatedPayment == null)
        {
            return StatusCode(500, Payment_C.FailedToUpdatePaymentStatus);
        }

        ResponseDto res = new ResponseDto();
        return Ok(res.success(Payment_C.PaymentUpdated));
    }
}
