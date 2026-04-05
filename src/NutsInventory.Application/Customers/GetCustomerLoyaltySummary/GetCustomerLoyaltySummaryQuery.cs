using MediatR;
using NutsInventory.Application.Customers.Common;

namespace NutsInventory.Application.Customers.GetCustomerLoyaltySummary;

public sealed record GetCustomerLoyaltySummaryQuery(int CustomerId)
    : IRequest<CustomerLoyaltySummaryDto>;