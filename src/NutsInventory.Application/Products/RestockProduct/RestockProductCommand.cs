using MediatR;

namespace NutsInventory.Application.Products.RestockProduct;

public sealed record RestockProductCommand(
    int ProductId,
    int Quantity,
    string? Reason
) : IRequest<Unit>;