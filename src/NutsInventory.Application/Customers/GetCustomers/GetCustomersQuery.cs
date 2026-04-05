using MediatR;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomers;

public sealed record GetCustomersQuery(
    string? Search = null,
    bool? IsActive = true
) : IRequest<IReadOnlyList<CustomerDto>>;