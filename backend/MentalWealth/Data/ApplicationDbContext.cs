using MentalWealth.Data.Common;
using MentalWealth.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.DataEncryption;
using Microsoft.EntityFrameworkCore.DataEncryption.Providers;

namespace MentalWealth.Data;

public class ApplicationDbContext : IdentityDbContext<ApiUser>
{
    private readonly IEncryptionProvider _provider;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) :
        base(options)
    {
        var encryptionProvider = new AesProvider(Convert.FromBase64String(configuration["EncryptionKey"]));
        _provider = encryptionProvider;
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<JournalEntry> JournalEntries { get; set; }
    public DbSet<ShareToken> ShareTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.UseEncryption(_provider);

        builder.Entity<ApiUser>().HasMany(p => p.RefreshTokens).WithOne(f => f.User).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<ApiUser>().HasMany(p => p.JournalEntries).WithOne(p => p.Author)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Entity<JournalEntry>().HasMany(p => p.ShareTokens).WithOne(f => f.JournalEntry)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(builder);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
    {
        UpdateTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && e.State is EntityState.Added or EntityState.Modified);

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added) ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
        }
    }
}