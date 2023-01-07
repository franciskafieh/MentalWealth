using System.Security.Claims;
using System.Security.Cryptography;
using AutoMapper;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentalWealth.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class ShareController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public ShareController(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<string>> Create([FromBody] ShareCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var journalEntry = await _dbContext.JournalEntries.FindAsync(request.JournalEntryId);
        if (journalEntry == null || journalEntry.AuthorId != userId)
        {
            ModelState.AddModelError(nameof(request.JournalEntryId), "Invalid journal entry");
            return ValidationProblem();
        }

        var recipient = await _dbContext.Users.FindAsync(request.RecipientId);
        if (recipient == null)
        {
            ModelState.AddModelError(nameof(request.RecipientId), "Invalid recipient");
            return ValidationProblem();
        }

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        var shareToken = new ShareToken
        {
            Token = token,
            JournalEntryId = request.JournalEntryId,
            ExpiryDate = request.ExpiryDate,
            RecipientId = request.RecipientId
        };

        return Ok(token);
    }
}