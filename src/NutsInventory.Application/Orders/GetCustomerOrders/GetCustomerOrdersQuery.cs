using MediatR;
using NutsInventory.Application.Orders.Common;

namespace NutsInventory.Application.Orders.GetCustomerOrders;

public sealed record GetCustomerOrdersQuery(int CustomerId)
    : IRequest<IReadOnlyList<CustomerOrderDto>>;