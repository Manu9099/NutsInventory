using MediatR;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetProducts;

public sealed record GetProductsQuery(
    string? Search = null,
    string? Category = null,
    bool? IsActive = true
) : IRequest<IReadOnlyList<ProductDto>>;