using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using MentalWealth.Auth;
using MentalWealth.Auth.Services;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using MentalWealth.Data.Models.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace MentalWealth.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class AuthController : Controller
{
    private readonly IAuthService _authService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly SignInManager<ApiUser> _signInManager;
    private readonly UserManager<ApiUser> _userManager;

    public AuthController(IAuthService authService, IMapper mapper, SignInManager<ApiUser> signInManager,
        ApplicationDbContext dbContext, UserManager<ApiUser> userManager)
    {
        _authService = authService;
        _mapper = mapper;
        _signInManager = signInManager;
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpPost("Register")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = _mapper.Map<ApiUser>(request);

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                switch (error.Code)
                {
                    case "DuplicateUserName":
                        ModelState.AddModelError(nameof(request.UserName), error.Description);
                        break;
                    case "DuplicateEmail":
                        ModelState.AddModelError(nameof(request.Email), error.Description);
                        break;
                    case "PasswordTooShort":
                        ModelState.AddModelError(nameof(request.Password), error.Description);
                        break;
                    default:
                        ModelState.AddModelError(nameof(request.UserName), error.Description);
                        break;
                }
            }

            return ValidationProblem();
        }


        return NoContent();
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            ModelState.AddModelError(nameof(LoginRequest.Email), "Email or password is invalid");
            return ValidationProblem();
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password,
            await _userManager.GetLockoutEnabledAsync(user));

        if (result == SignInResult.Failed)
        {
            ModelState.AddModelError(nameof(LoginRequest.Email), "Email or password is invalid");
            return ValidationProblem();
        }


        var authClaims = await _authService.GetAuthClaims(user);
        var token = _authService.GetAuthToken(authClaims);

        var userResponse = _mapper.Map<LoginResponseUser>(user);
        userResponse.Roles = authClaims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

        if (request.Remember)
        {
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.Now.AddDays(AuthConstants.RefreshTokenExpirationDays),
                HttpOnly = true,
                IsEssential = true,
                Secure = true
            };
            Response.Cookies.Append("refreshToken", await _authService.GetRefreshTokenAsync(user.Id),
                cookieOptions);
        }

        return Ok(new LoginResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = token.ValidTo,
            User = userResponse
        });
    }

    [HttpPost("Refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponse>> Refresh()
    {
        var token = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(token))
        {
            ModelState.AddModelError("refreshToken", "Refresh token is missing");
            return ValidationProblem();
        }

        var refreshToken =
            await _dbContext.RefreshTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.Token == token);
        if (refreshToken == null ||
            refreshToken.CreatedAt.AddDays(AuthConstants.RefreshTokenExpirationDays) < DateTime.Now)
        {
            ModelState.AddModelError("refreshToken", "Refresh token is invalid");
            return ValidationProblem();
        }

        var newRefreshToken = await _authService.GetRefreshTokenAsync(refreshToken.User!.Id);

        var authClaims = await _authService.GetAuthClaims(refreshToken.User);
        var authToken = _authService.GetAuthToken(authClaims);

        var userResponse = _mapper.Map<LoginResponseUser>(refreshToken.User);
        userResponse.Roles = authClaims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

        var cookieOptions = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(AuthConstants.RefreshTokenExpirationDays),
            HttpOnly = true,
            IsEssential = true,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        _dbContext.RefreshTokens.Remove(refreshToken);
        await _dbContext.SaveChangesAsync();

        return Ok(new LoginResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(authToken),
            ExpiresAt = authToken.ValidTo,
            User = userResponse
        });
    }

    [HttpDelete("Logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> Logout()
    {
        var token = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return NoContent();

        Response.Cookies.Delete("refreshToken");

        var refreshToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token);
        if (refreshToken == null)
            return NoContent();

        _dbContext.RefreshTokens.Remove(refreshToken);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}