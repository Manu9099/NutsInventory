using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Domain.Entities;

namespace NutsInventory.Infrastructure.Persistence;

public class NutsDbContext : DbContext, INutsDbContext
{
    public NutsDbContext(DbContextOptions<NutsDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<LoyaltyTransaction> LoyaltyTransactions => Set<LoyaltyTransaction>();
    public DbSet<SalesMetric> SalesMetrics => Set<SalesMetric>();
    public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        => Database.BeginTransactionAsync(cancellationToken);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(b =>
        {
            b.ToTable("products");
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            b.Property(x => x.Sku).HasColumnName("sku").HasMaxLength(50).IsRequired();
            b.Property(x => x.Description).HasColumnName("description");
            b.Property(x => x.Price).HasColumnName("price").HasPrecision(10, 2);
            b.Property(x => x.StockQuantity).HasColumnName("stock_quantity");
            b.Property(x => x.ReorderLevel).HasColumnName("reorder_level");
            b.Property(x => x.Category).HasColumnName("category").HasMaxLength(100);
            b.Property(x => x.Weight).HasColumnName("weight").HasPrecision(8, 3);
            b.Property(x => x.ImageUrl).HasColumnName("image_url");
            b.Property(x => x.IsActive).HasColumnName("is_active");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
            b.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            b.HasIndex(x => x.Sku).IsUnique();
        });

                                    modelBuilder.Entity<Customer>(b =>
                                {
                                    b.ToTable("customers");
                                    b.HasKey(x => x.Id);

                                    b.Property(x => x.Email)
                                        .HasColumnName("email")
                                        .HasMaxLength(255)
                                        .IsRequired();

                                    b.Property(x => x.FirstName)
                                        .HasColumnName("first_name")
                                        .HasMaxLength(100)
                                        .IsRequired();

                                    b.Property(x => x.LastName)
                                        .HasColumnName("last_name")
                                        .HasMaxLength(100)
                                        .IsRequired();

                                    b.Property(x => x.Phone)
                                        .HasColumnName("phone")
                                        .HasMaxLength(20);

                                    b.Property(x => x.City)
                                        .HasColumnName("city")
                                        .HasMaxLength(100);

                                    b.Property(x => x.Address)
                                        .HasColumnName("address");

                                    b.Property(x => x.PasswordHash)
                                        .HasColumnName("password_hash");

                                    b.Property(x => x.RegisteredAt)
                                        .HasColumnName("registered_at");

                                    b.Property(x => x.LastPurchaseDate)
                                        .HasColumnName("last_purchase_date");

                                    b.Property(x => x.TotalSpent)
                                        .HasColumnName("total_spent")
                                        .HasPrecision(12, 2);

                                    b.Property(x => x.TotalPurchases)
                                        .HasColumnName("total_purchases");

                                    b.Property(x => x.LoyaltyPoints)
                                        .HasColumnName("loyalty_points");

                                    b.Property(x => x.Tier)
                                        .HasColumnName("tier")
                                        .HasConversion<string>();

                                    b.Property(x => x.IsActive)
                                        .HasColumnName("is_active");

                                    b.Property(x => x.CreatedAt)
                                        .HasColumnName("created_at");

                                    b.Property(x => x.UpdatedAt)
                                        .HasColumnName("updated_at");

                                    b.HasIndex(x => x.Email).IsUnique();
                                });
                                
        modelBuilder.Entity<Order>(b =>
        {
            b.ToTable("orders");
            b.HasKey(x => x.Id);
            b.Property(x => x.CustomerId).HasColumnName("customer_id");
            b.Property(x => x.TotalAmount).HasColumnName("total_amount").HasPrecision(10, 2);
            b.Property(x => x.Status).HasColumnName("status").HasConversion<string>();
            b.Property(x => x.OrderDate).HasColumnName("order_date");
            b.Property(x => x.CompletedDate).HasColumnName("completed_date");
            b.Property(x => x.DiscountApplied).HasColumnName("discount_applied").HasPrecision(10, 2);
            b.Property(x => x.LoyaltyPointsEarned).HasColumnName("loyalty_points_earned");
            b.Property(x => x.Notes).HasColumnName("notes");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
            b.Property(x => x.UpdatedAt).HasColumnName("updated_at");

       b.HasOne(x => x.Customer)
        .WithMany()
        .HasForeignKey(x => x.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);

    b.HasMany(x => x.Items)
        .WithOne(x => x.Order)
        .HasForeignKey(x => x.OrderId)
        .OnDelete(DeleteBehavior.Cascade);

    b.Navigation(x => x.Items)
        .UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        modelBuilder.Entity<OrderItem>(b =>
        {
            b.ToTable("order_items");
            b.HasKey(x => x.Id);
            b.Property(x => x.ProductId).HasColumnName("product_id");
            b.Property(x => x.Quantity).HasColumnName("quantity");
            b.Property(x => x.UnitPrice).HasColumnName("unit_price").HasPrecision(10, 2);
            b.Property(x => x.Subtotal).HasColumnName("subtotal").HasPrecision(10, 2);
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<LoyaltyTransaction>(b =>
        {
            b.ToTable("loyalty_transactions");
            b.HasKey(x => x.Id);
            b.Property(x => x.CustomerId).HasColumnName("customer_id");
            b.Property(x => x.PointsAdded).HasColumnName("points_added");
            b.Property(x => x.Reason).HasColumnName("reason").HasConversion<string>();
            b.Property(x => x.OrderId).HasColumnName("order_id");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<SalesMetric>(b =>
        {
            b.ToTable("sales_metrics");
            b.HasKey(x => x.Id);
            b.Property(x => x.ProductId).HasColumnName("product_id");
            b.Property(x => x.Month).HasColumnName("month");
            b.Property(x => x.Year).HasColumnName("year");
            b.Property(x => x.QuantitySold).HasColumnName("quantity_sold");
            b.Property(x => x.Revenue).HasColumnName("revenue").HasPrecision(12, 2);
            b.Property(x => x.AveragePrice).HasColumnName("average_price").HasPrecision(10, 2);
            b.Property(x => x.Rank).HasColumnName("rank");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
            b.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            b.HasIndex(x => new { x.ProductId, x.Month, x.Year }).IsUnique();
        });

        modelBuilder.Entity<InventoryMovement>(b =>
        {
            b.ToTable("inventory_movements");
            b.HasKey(x => x.Id);
            b.Property(x => x.ProductId).HasColumnName("product_id");
            b.Property(x => x.MovementType).HasColumnName("movement_type").HasConversion<string>();
            b.Property(x => x.QuantityChange).HasColumnName("quantity_change");
            b.Property(x => x.Reason).HasColumnName("reason");
            b.Property(x => x.PreviousQuantity).HasColumnName("previous_quantity");
            b.Property(x => x.NewQuantity).HasColumnName("new_quantity");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
        });
        modelBuilder.Entity<AdminUser>(b =>
        {
            b.ToTable("admin_users");
            b.HasKey(x => x.Id);

            b.Property(x => x.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            b.Property(x => x.FullName).HasColumnName("full_name").HasMaxLength(150).IsRequired();
            b.Property(x => x.PasswordHash).HasColumnName("password_hash").IsRequired();
            b.Property(x => x.Role).HasColumnName("role").HasMaxLength(50).IsRequired();
            b.Property(x => x.IsActive).HasColumnName("is_active");
            b.Property(x => x.CreatedAt).HasColumnName("created_at");
            b.Property(x => x.UpdatedAt).HasColumnName("updated_at");

            b.HasIndex(x => x.Email).IsUnique();
        });
    }
}