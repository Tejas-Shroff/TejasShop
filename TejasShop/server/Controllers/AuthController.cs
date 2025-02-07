using AutoMapper;
using server.Dto;
using server.Entities;
using server.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Interface.Repository;
using server.Constants;

namespace server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IJwtHelper helper;
        private readonly IMapper mapper;

        public AuthController(IUserRepository userRepository, IJwtHelper helper, IMapper mapper)
        {
            this.mapper = mapper;
            this.userRepository = userRepository;
            this.helper = helper;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<ResponseDto>> Login([FromBody] LoginUserReqDto req)
        {
            User? user = await this.userRepository.GetUserByEmail(req.Email!);
            ResponseDto res = new ResponseDto();

            if (user == null)
            {
                res.IsSuccessed = false;
                res.Message = Auth.InvalidUserName;
                return BadRequest(res);
            }

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
            {
                res.IsSuccessed = false;
                res.Message = Auth.InvalidPassword;
                return BadRequest(res);
            }
            var RefreshToken = helper.GenerateRefreshToken();

            user.RefreshToken = RefreshToken;
            user.RefreshTokenExpire = DateTime.Now.AddDays(2);

            await userRepository.UpdateUser(user);

            LoginUserResDto userDetail = new LoginUserResDto()
            {
                AccessToken = this.helper.GenerateJwtToken(user),
                RefreshToken = RefreshToken,
                userData = this.mapper.Map<UserDto>(user),
                role = user.Role
            };

            res.Data = userDetail;

            return Ok(res);
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<ResponseDto>> Register([FromBody] RegisterUserReqDto req)
        {
            User? user = await this.userRepository.GetUserByEmail(req.Email!);
            ResponseDto res = new();
            if (user != null)
            {
                res.IsSuccessed = false;
                res.Message = string.Format(Auth.UserAlreadyExists, req.Email);
                return BadRequest(res);
            }

            User newUser = new User()
            {
                UserName = req.UserName,
                Email = req.Email,
                Address = req.Address,
                Role = req?.Role?.ToUpper(),
                Password = BCrypt.Net.BCrypt.HashPassword(req?.Password),  // it genrates unique hash everytime you enter the password, even for same password, it is resistant to brute force attacks.
                RefreshToken = "",
                RefreshTokenExpire = DateTime.Now.AddDays(2)  // we can set expiration of token here, as currently it will set for 2 days for the particular user.
            };
            bool result = await this.userRepository.AddUser(newUser);

            if (!result)
            {
                res.IsSuccessed = false;
                res.Message = Auth.InternalServerError;
                return BadRequest(res);
            }
            res.Message = Auth.RegisteredSuccessfully;
            return Ok(res);
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<ActionResult<ResponseDto>> RefreshToken([FromBody] RefreshTokenDto req)
        {
            ResponseDto res = new ResponseDto();
            if (string.IsNullOrEmpty(req.RefreshToken) || string.IsNullOrEmpty(req.AccessToken))
            {
                res.IsSuccessed = false;
                res.Message = Auth.InvalidRequest;
                return BadRequest(res);
            }

            var refreshToken = req.RefreshToken;
            var accessToken = req.AccessToken;

            var principal = helper.GetPrincipalFromExpiredToken(accessToken);
            var email = principal?.Identity?.Name;

            User? user = await this.userRepository.GetUserByEmail(email!);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpire <= DateTime.Now)
            {
                res.IsSuccessed = false;
                res.Message = Auth.InvalidRequest;
                return BadRequest(res);
            }

            refreshToken = helper.GenerateRefreshToken();
            accessToken = helper.GenerateJwtToken(user);

            user.RefreshToken = refreshToken;

            await userRepository.UpdateUser(user);

            //RefreshTokenDto data = new RefreshTokenDto(){
            //    AccessToken=accessToken,
            //    RefreshToken=refreshToken
            //};

            LoginUserResDto data = new LoginUserResDto()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                userData = this.mapper.Map<UserDto>(user)
            };

            res.Data = data;

            return Ok(res);
        }

        [HttpGet, Authorize]
        [Route("revoke")]
        public async Task<ActionResult<ResponseDto>> Revoke()
        {
            ResponseDto res = new ResponseDto();
            var email = User?.Identity?.Name;
            User? user = await this.userRepository.GetUserByEmail(email!);
            if (user == null)
            {
                res.IsSuccessed = false;
                res.Message = Constants.Auth.InvalidRequest;
                return BadRequest(res);
            }
            user.RefreshToken = "";
            user.RefreshTokenExpire = DateTime.Now;

            await this.userRepository.UpdateUser(user);

            res.Message = Auth.LoggedOut;
            return Ok(res);
        }
    }
}
