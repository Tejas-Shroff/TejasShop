using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Constants;
using server.Dto;
using server.Entities;
using server.Interface.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "ADMIN,USER")]

    public class CartController : ControllerBase
    {
        private readonly ICartService cartService;
        private readonly IMapper mapper;

        public CartController(ICartService cartService,IMapper mapper)
        {
            this.cartService = cartService;
            this.mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<ResponseDto>> GetUserCart()
        {
            if (!Int32.TryParse(User.FindFirst(UserId.userId)?.Value, out int userId))
            {
                return Unauthorized();
            }
            ResponseDto responseDto = new();
            ShoppingCart? cart = await cartService.FindUserCart(userId);

            if(cart == null){
                return NotFound();
            }
            ShoppingCartResDto cartResData = mapper.Map<ShoppingCartResDto>(cart);
            return Ok(responseDto.success(Constants.Cart.Successfull, cartResData));
            
        }
        [HttpPost]
        public async Task<ActionResult<ResponseDto>> AddItemToCart([FromBody] AddItemToCartRequest item)
        {
            if (!Int32.TryParse(User.FindFirst(UserId.userId)?.Value, out int userId))
            {
                return Unauthorized();
            }
            ResponseDto responseDto = new();
            await cartService.AddItemToCart(userId,item.ProductId,item.Quantity);
            return Ok(responseDto.success(Constants.Cart.SucessfullyAddedToCart));
        }
        
    }
}
