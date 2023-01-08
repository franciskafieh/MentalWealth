using System.Security.Cryptography;
using MentalWealth.Data;
using MentalWealth.Data.Entities;

namespace MentalWealth.Services;

public class ShareService : IShareService
{
    private ApplicationDbContext _dbContext;
    
    public ShareService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task<string> CreateShareToken(string recipientId, DateTime expirationDate, int entryId)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        var shareToken = new ShareToken
        {
            Token = token,
            JournalEntryId = entryId,
            ExpiryDate = expirationDate,
            RecipientId = recipientId
        };
        
        await _dbContext.ShareTokens.AddAsync(shareToken);
        await _dbContext.SaveChangesAsync();

        return token;
    }
}