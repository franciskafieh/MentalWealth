using System.Security.Cryptography;
using MentalWealth.Data;
using MentalWealth.Data.Entities;
using MentalWealth.Realtime.Services;
using MentalWealth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MentalWealth.Realtime;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMoneyService _moneyService;
    private readonly IShareService _shareService;

    public ChatHub(IChatService chatService, ApplicationDbContext dbContext, IMoneyService moneyService, IShareService shareService)
    {
        _chatService = chatService;
        _dbContext = dbContext;
        _moneyService = moneyService;
        _shareService = shareService;
    }

    public async Task Join(bool helper)
    {
        var connectedUser = await _chatService.Join(Context.UserIdentifier, helper);
        if (connectedUser != null)
        {
            await Clients.Caller.SendAsync("Joined");
            await Clients.User(connectedUser).SendAsync("Joined");
            await _moneyService.AddMoney(connectedUser, 1);
            await _moneyService.AddMoney(Context.UserIdentifier, 1);
            return;
        }
        await Clients.Caller.SendAsync("Waiting");
    }
    
    public async Task Leave()
    {
        var disconnectedUser = await _chatService.Leave(Context.UserIdentifier);
        if (disconnectedUser != null)
        {
            await Clients.User(disconnectedUser).SendAsync("Left");
        }
        await Clients.Caller.SendAsync("Left");
    }
    
    public async Task SendMessage(string message)
    {
        var partnerId = await _chatService.GetPartner(Context.UserIdentifier);
        if (partnerId != null)
        {
            await Clients.User(partnerId).SendAsync("ReceiveMessage", message);
        }
    }

    public async Task ShareJournalEntry(int entryId, DateTime expirationDate)
    {
        var journalEntry = await _dbContext.JournalEntries.FindAsync(entryId);
        if (journalEntry == null || journalEntry.AuthorId != Context.UserIdentifier)
            return;
        
        var partnerId = await _chatService.GetPartner(Context.UserIdentifier);

        var recipient = await _dbContext.Users.FindAsync(partnerId);
        if (recipient == null)
            return;

        var token = await _shareService.CreateShareToken(recipient.Id, expirationDate, entryId);

        await Clients.Caller.SendAsync("ShareTokenGenerated", token);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var disconnectedUser = await _chatService.Leave(Context.UserIdentifier);
        if (disconnectedUser != null)
        {
            await Clients.User(disconnectedUser).SendAsync("Left");
        }
        await base.OnDisconnectedAsync(exception);
    }
}