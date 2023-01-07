using System.ComponentModel.DataAnnotations;

namespace MentalWealth.Data.Models.Requests;

public class ShareCreateRequest
{
    [Required] public int JournalEntryId { get; set; }
    [Required] public string RecipientId { get; set; }
    [Required] public DateTime ExpiryDate { get; set; }
}