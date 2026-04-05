using MediatR;

namespace NutsInventory.Application.Orders.CreateOrder;

public sealed record CreateOrderCommand(
    int CustomerId,
    List<CreateOrderItemRequest> Items,
    int LoyaltyPointsToRedeem,
    string? Notes
) : IRequest<CreateOrderResponse>;

public sealed record CreateOrderItemRequest(
    int ProductId,
    int Quantity
);

public sealed record CreateOrderResponse(
    int OrderId,
    decimal GrossAmount,
    decimal DiscountApplied,
    decimal NetAmount,
    int LoyaltyPointsEarned
);