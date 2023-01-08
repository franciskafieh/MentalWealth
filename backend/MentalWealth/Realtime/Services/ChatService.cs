using MentalWealth.Data;
using MentalWealth.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace MentalWealth.Realtime.Services;

public class ChatService : IChatService
{
    private Dictionary<string, string> _helperToUser = new Dictionary<string, string>();
    private Dictionary<string, string> _userToHelper = new Dictionary<string, string>();
    
    private Queue<string> _helperQueue = new Queue<string>();
    private Queue<string> _userQueue = new Queue<string>();

    public async Task<string?> Join(string id, bool helper)
    {
        if (helper)
        {
            if (_userQueue.Count > 0)
            {
                var userToConnect = _userQueue.Dequeue();
                _helperToUser.Add(id, userToConnect);
                _userToHelper.Add(userToConnect, id);
                return userToConnect;
            }
            else
            {
                _helperQueue.Enqueue(id);
            }
            return null;
        }

        if (_helperQueue.Count > 0)
        {
            var helperToConnect = _helperQueue.Dequeue();
            _helperToUser.Add(helperToConnect, id);
            _userToHelper.Add(id, helperToConnect);
            return helperToConnect;
        }
        else
        {
            _userQueue.Enqueue(id);
        }
        return null;
    }

    public async Task<string?> Leave(string id)
    {
        
        
        if (_helperToUser.ContainsKey(id))
        {
            var userId = _helperToUser[id];
            _userToHelper.Remove(userId);
            _helperToUser.Remove(id);
            return userId;
        }

        if (_userToHelper.ContainsKey(id))
        {
            var helperId = _userToHelper[id];
            _helperToUser.Remove(helperId);
            _userToHelper.Remove(id);
            return helperId;
        }

  
        _helperQueue = new Queue<string>(_helperQueue.Where(h => h != id));
        _userQueue = new Queue<string>(_userQueue.Where(u => u != id));
            
        return null;
    }

    public async Task<string?> GetPartner(string id)
    {
        if (_helperToUser.ContainsKey(id))
        {
            var userId = _helperToUser[id];
            return userId;
        }

        if (_userToHelper.ContainsKey(id))
        {
            var helperId = _userToHelper[id];
            return helperId;
        }

        return null;
    }
}