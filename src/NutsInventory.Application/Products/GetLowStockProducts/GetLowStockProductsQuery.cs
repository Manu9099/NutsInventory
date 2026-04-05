using MediatR;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetLowStockProducts;

public sealed record GetLowStockProductsQuery() : IRequest<IReadOnlyList<ProductDto>>;