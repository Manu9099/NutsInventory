using NutsInventory.Domain.Common;

namespace NutsInventory.Domain.Entities;

public class Product : AuditableEntity
{
    private Product() { }

    public Product(
        string name,
        string sku,
        string category,
        decimal price,
        int stockQuantity,
        int reorderLevel,
        decimal weight,
        string? description = null,
        string? imageUrl = null)
    {
        Name = name;
        Sku = sku;
        Category = category;
        Price = price;
        StockQuantity = stockQuantity;
        ReorderLevel = reorderLevel;
        Weight = weight;
        Description = description;
        ImageUrl = imageUrl;
        IsActive = true;
    }

    public string Name { get; private set; } = default!;
    public string Sku { get; private set; } = default!;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public int ReorderLevel { get; private set; }
    public string Category { get; private set; } = default!;
    public decimal Weight { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; }

    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("La cantidad debe ser mayor a 0.");
        if (StockQuantity < quantity) throw new InvalidOperationException("Stock insuficiente.");

        StockQuantity -= quantity;
        Touch();
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("La cantidad debe ser mayor a 0.");

        StockQuantity += quantity;
        Touch();
    }

    public void UpdatePrice(decimal price)
    {
        if (price <= 0) throw new ArgumentException("El precio debe ser mayor a 0.");
        Price = price;
        Touch();
    }public void UpdateDetails(
    string name,
    string sku,
    string category,
    decimal price,
    int reorderLevel,
    decimal weight,
    string? description,
    string? imageUrl)
{
    if (string.IsNullOrWhiteSpace(name))
        throw new ArgumentException("El nombre es obligatorio.");

    if (string.IsNullOrWhiteSpace(sku))
        throw new ArgumentException("El SKU es obligatorio.");

    if (string.IsNullOrWhiteSpace(category))
        throw new ArgumentException("La categoría es obligatoria.");

    if (price <= 0)
        throw new ArgumentException("El precio debe ser mayor a 0.");

    if (reorderLevel < 0)
        throw new ArgumentException("El reorder level no puede ser negativo.");

    if (weight <= 0)
        throw new ArgumentException("El peso debe ser mayor a 0.");

    Name = name;
    Sku = sku;
    Category = category;
    Price = price;
    ReorderLevel = reorderLevel;
    Weight = weight;
    Description = description;
    ImageUrl = imageUrl;

    Touch();
}

public void Deactivate()
{
    IsActive = false;
    Touch();
}
public void Reactivate()
{
    IsActive = true;
    Touch();
}



}