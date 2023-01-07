namespace MentalWealth.Data.Models.Responses;

public class JournalViewResponse
{
    public string Title { get; set; }
    public int MoodLevel { get; set; }
    public string Content { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}