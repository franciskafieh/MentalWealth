using System.Security.Claims;
using MentalWealth.Data;
using MentalWealth.Data.Models.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentalWealth.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class MoneyController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    
    public MoneyController(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    [HttpGet]
    public async Task<ActionResult<MoneyViewResponse>> Get()
    {
        var user = await _dbContext.Users.FindAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
        return Ok(new MoneyViewResponse
        {
            Balance = user.Balance
        });
    }
    
}