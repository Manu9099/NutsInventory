using MediatR;

namespace NutsInventory.Application.Dashboard.GetDashboardSummary;

public sealed record GetDashboardSummaryQuery() : IRequest<DashboardSummaryDto>;