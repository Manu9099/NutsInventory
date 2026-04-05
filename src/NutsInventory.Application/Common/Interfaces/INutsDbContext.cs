using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using NutsInventory.Domain.Entities;


namespace NutsInventory.Application.Common.Interfaces;

public interface INutsDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<LoyaltyTransaction> LoyaltyTransactions { get; }
    DbSet<SalesMetric> SalesMetrics { get; }
    DbSet<InventoryMovement> InventoryMovements { get; }
    DbSet<AdminUser> AdminUsers { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}