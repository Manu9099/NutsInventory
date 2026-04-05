using MediatR;
using NutsInventory.Application.Inventory.Common;

namespace NutsInventory.Application.Inventory.GetInventoryMovements;

public sealed record GetInventoryMovementsQuery(
    int? ProductId = null,
    int Limit = 50
) : IRequest<IReadOnlyList<InventoryMovementDto>>;