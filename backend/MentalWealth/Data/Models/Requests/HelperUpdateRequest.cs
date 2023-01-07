using System.ComponentModel.DataAnnotations;

namespace MentalWealth.Data.Models.Requests;

public class HelperUpdateRequest
{
    [Required] public bool Helper { get; set; }
}