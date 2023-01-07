using System.ComponentModel.DataAnnotations;
using MentalWealth.Data.Common;

namespace MentalWealth.Data.Entities;

public class RefreshToken : BaseEntity
{
    [Key] public int Id { get; set; }

    [Required] public string Token { get; set; }

    public string UserId { get; set; }
    [Required] public ApiUser? User { get; set; }
}