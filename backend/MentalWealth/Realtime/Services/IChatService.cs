namespace MentalWealth.Realtime.Services;

public interface IChatService
{
    Task<string?> Join(string id, bool helper);
    Task<string?> Leave(string id);
    Task<string?> GetPartner(string id);
}