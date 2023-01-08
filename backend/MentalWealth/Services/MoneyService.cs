using MentalWealth.Data;

namespace MentalWealth.Services;

public class MoneyService : IMoneyService
{
    private readonly ApplicationDbContext _dbContext;
    
    public MoneyService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task AddMoney(string userId, int amount)
    { 
        var user = await _dbContext.Users.FindAsync(userId);
        user.Balance += amount;
        await _dbContext.SaveChangesAsync();
    }

    public async Task RemoveMoney(string userId, int amount)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        user.Balance -= amount;
        await _dbContext.SaveChangesAsync();
    }
}