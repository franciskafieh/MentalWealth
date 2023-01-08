namespace MentalWealth.Services;

public interface IMoneyService
{
    Task AddMoney(string userId, int amount);
    Task RemoveMoney(string userId, int amount);
}