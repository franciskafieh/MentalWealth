using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MentalWealth.Data.Entities;

namespace MentalWealth.Auth.Services;

public interface IAuthService
{
    Task<List<Claim>> GetAuthClaims(ApiUser user);
    JwtSecurityToken GetAuthToken(List<Claim> authClaims);
    Task<string> GetRefreshTokenAsync(string userId);
}