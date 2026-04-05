namespace NutsInventory.Application.Products.Common;

public sealed record ProductDto(
    int Id,
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    int StockQuantity,
    int ReorderLevel,
    string Category,
    decimal Weight,
    string? ImageUrl,
    bool IsActive
);