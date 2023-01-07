using System.ComponentModel.DataAnnotations;

namespace MentalWealth.Data.Models.Requests;

public class JournalCreateRequest
{
    [Required] [MaxLength(256)] public string Title { get; set; }
    [Required] public int MoodLevel { get; set; }
    [Required] public string Content { get; set; }
}