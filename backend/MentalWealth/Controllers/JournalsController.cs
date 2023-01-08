using System.Security.Claims;
using AutoMapper;
using Ganss.Xss;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using MentalWealth.Data.Models.Requests;
using MentalWealth.Data.Models.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalWealth.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class JournalsController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly HtmlSanitizer _htmlSanitizer;

    public JournalsController(ApplicationDbContext dbContext, IMapper mapper, HtmlSanitizer htmlSanitizer)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _htmlSanitizer = htmlSanitizer;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<JournalIndexResponse>>> Index()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var journals = await _dbContext.JournalEntries.Where(j => j.AuthorId == userId).OrderByDescending(j => j.UpdatedAt).ToListAsync();
        return Ok(_mapper.Map<IEnumerable<JournalIndexResponse>>(journals));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JournalViewResponse>> View([FromRoute] int id, [FromQuery] string? token)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var journal = await _dbContext.JournalEntries.FindAsync(id);

        if (journal == null) return NotFound();

        if (journal.AuthorId == userId) return Ok(_mapper.Map<JournalViewResponse>(journal));

        if (token != null)
        {
            var shareToken = await _dbContext.ShareTokens.FirstOrDefaultAsync(t => t.Token == token);
            if (shareToken == null || shareToken.RecipientId != userId || shareToken.JournalEntryId != id ||
                shareToken.ExpiryDate < DateTime.Now) return NotFound();

            return Ok(_mapper.Map<JournalViewResponse>(journal));
        }

        return NotFound();
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<JournalViewResponse>> Create([FromBody] JournalCreateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var journal = _mapper.Map<JournalEntry>(request);
        journal.Content = _htmlSanitizer.Sanitize(request.Content);
        journal.AuthorId = userId!;

        _dbContext.JournalEntries.Add(journal);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(View), new { id = journal.Id }, _mapper.Map<JournalViewResponse>(journal));
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Update([FromRoute] int id, [FromBody] JournalUpdateRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var journal = await _dbContext.JournalEntries.FindAsync(id);

        if (journal == null || journal.AuthorId != userId) return NotFound();

        _mapper.Map(request, journal);
        journal.Content = _htmlSanitizer.Sanitize(request.Content);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var journal = await _dbContext.JournalEntries.FindAsync(id);

        if (journal == null || journal.AuthorId != userId) return NotFound();

        _dbContext.JournalEntries.Remove(journal);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}