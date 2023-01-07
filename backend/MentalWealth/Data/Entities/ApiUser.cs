using Microsoft.AspNetCore.Identity;

namespace MentalWealth.Data.Entities;

public class ApiUser : IdentityUser
{
    public List<JournalEntry>? JournalEntries { get; set; }
    public List<RefreshToken>? RefreshTokens { get; set; }
}