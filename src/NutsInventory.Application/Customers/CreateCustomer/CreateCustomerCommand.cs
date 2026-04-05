using MediatR;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.CreateCustomer;

public sealed record CreateCustomerCommand(
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string? City,
    string? Address
) : IRequest<CustomerDto>;