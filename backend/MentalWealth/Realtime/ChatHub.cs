using MentalWealth.Realtime.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MentalWealth.Realtime;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public async Task Join(bool helper)
    {
        var connectedUser = await _chatService.Join(Context.UserIdentifier, helper);
        if (connectedUser != null)
        {
            await Clients.Caller.SendAsync("Joined");
            await Clients.User(connectedUser).SendAsync("Joined");
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