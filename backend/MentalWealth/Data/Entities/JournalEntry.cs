using System.ComponentModel.DataAnnotations;
using MentalWealth.Data.Common;

namespace MentalWealth.Data.Entities;

public class JournalEntry : BaseEntity
{
    [Key] public int Id { get; set; }

    [Required]
    [MaxLength(256)]
    [Encrypted]
    public string Title { get; set; }

    [Required] public int MoodLevel { get; set; }
    [Required] [Encrypted] public string Content { get; set; }

    public string AuthorId { get; set; }
    [Required] public ApiUser? Author { get; set; }

    public List<ShareToken>? ShareTokens { get; set; }
}