using System.ComponentModel.DataAnnotations;

namespace MentalWealth.Data.Models.Requests;

public class RegisterRequest : IValidatableObject
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }


    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Password != ConfirmPassword)
        {
            yield return new ValidationResult("Passwords do not match", new[] { nameof(Password), nameof(ConfirmPassword) });
        }
    }
}