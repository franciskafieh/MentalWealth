using Microsoft.AspNetCore.Identity;

namespace MentalWealth.Data.Entities;

public class ApiUser : IdentityUser
{
    public int Balance { get; set; }
    public List<JournalEntry>? JournalEntries { get; set; }
    public List<RefreshToken>? RefreshTokens { get; set; }
}