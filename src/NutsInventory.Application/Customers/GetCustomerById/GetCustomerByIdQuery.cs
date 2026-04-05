using MediatR;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerById;

public sealed record GetCustomerByIdQuery(int Id) : IRequest<CustomerDto?>;