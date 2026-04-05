using MediatR;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.CreateProduct;

public sealed record CreateProductCommand(
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    int StockQuantity,
    int ReorderLevel,
    string Category,
    decimal Weight,
    string? ImageUrl
) : IRequest<ProductDto>;