using System.Security.Claims;
using AutoMapper;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using MentalWealth.Data.Models.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MentalWealth.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class UserController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApiUser> _userManager;

    public UserController(ApplicationDbContext dbContext, IMapper mapper, UserManager<ApiUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserResponse>> GetUser()
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(_mapper.Map<UserResponse>(user));
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> DeleteSelf()
    {
        var user = await _dbContext.Users.FindAsync(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        _dbContext.Users.Remove(user!);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
    
}