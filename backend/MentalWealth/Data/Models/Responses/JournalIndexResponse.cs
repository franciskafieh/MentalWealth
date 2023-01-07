namespace MentalWealth.Data.Models.Responses;

public class JournalIndexResponse
{
    public string Title { get; set; }
    public int MoodLevel { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}