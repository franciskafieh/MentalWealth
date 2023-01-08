namespace MentalWealth.Services;

public interface IShareService
{
    Task<string> CreateShareToken(string recipientId, DateTime expirationDate, int entryId);
}