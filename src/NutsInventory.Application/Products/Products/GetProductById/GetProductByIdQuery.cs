using MediatR;
using NutsInventory.Application.Products.Common;

namespace NutsInventory.Application.Products.GetProductById;

public sealed record GetProductByIdQuery(int Id) : IRequest<ProductDto?>;