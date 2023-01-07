using System.ComponentModel.DataAnnotations;
using MentalWealth.Data.Common;

namespace MentalWealth.Data.Entities;

public class ShareToken : BaseEntity
{
    [Key] public int Id { get; set; }

    [Required] public string Token { get; set; }
    [Required] public DateTime ExpiryDate { get; set; }

    public string RecipientId { get; set; }
    [Required] public ApiUser? Recipient { get; set; }

    public int JournalEntryId { get; set; }
    [Required] public JournalEntry? JournalEntry { get; set; }
}