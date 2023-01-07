using Microsoft.EntityFrameworkCore;

namespace MentalWealth.Data;

public static class InjectDependencies
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, string? connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}