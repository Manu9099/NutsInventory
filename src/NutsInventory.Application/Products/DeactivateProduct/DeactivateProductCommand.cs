using MediatR;

namespace NutsInventory.Application.Products.DeactivateProduct;

public sealed record DeactivateProductCommand(int ProductId) : IRequest<Unit>;