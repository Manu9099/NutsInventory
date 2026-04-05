using MediatR;

namespace NutsInventory.Application.Products.ReactivateProduct;

public sealed record ReactivateProductCommand(int ProductId) : IRequest<Unit>;