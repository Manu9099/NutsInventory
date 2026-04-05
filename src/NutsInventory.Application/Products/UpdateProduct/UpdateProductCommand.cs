using MediatR;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.UpdateProduct;

public sealed record UpdateProductCommand(
    int Id,
    string Name,
    string Sku,
    string? Description,
    decimal Price,
    int ReorderLevel,
    string Category,
    decimal Weight,
    string? ImageUrl
) : IRequest<ProductDto>;