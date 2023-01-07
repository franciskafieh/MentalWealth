using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace MentalWealth.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApiUser> _userManager;

    public AuthService(UserManager<ApiUser> userManager, IConfiguration configuration, ApplicationDbContext dbContext)
    {
        _userManager = userManager;
        _configuration = configuration;
        _dbContext = dbContext;
    }

    public async Task<List<Claim>> GetAuthClaims(ApiUser user)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString())
        };

        var userRoles = await _userManager.GetRolesAsync(user);

        authClaims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        return authClaims;
    }

    public JwtSecurityToken GetAuthToken(List<Claim> authClaims)
    {
        var token = new JwtSecurityToken(
            _configuration["JWT:ValidIssuer"],
            expires: DateTime.Now.AddHours(AuthConstants.AuthTokenExpirationHours),
            claims: authClaims,
            signingCredentials: CreateSigningCredentials()
        );

        return token;
    }

    public async Task<string> GetRefreshTokenAsync(string userId)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        var refreshToken = new RefreshToken
        {
            Token = token,
            UserId = userId
        };

        _dbContext.Add(refreshToken);
        await _dbContext.SaveChangesAsync();

        return token;
    }

    private SigningCredentials CreateSigningCredentials()
    {
        return new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!)
            ),
            SecurityAlgorithms.HmacSha256
        );
    }
}