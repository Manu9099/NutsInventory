using MediatR;
using NutsInventory.Application.Dashboard.Common;

namespace NutsInventory.Application.Dashboard.GetMonthlySalesTrend;

public sealed record GetMonthlySalesTrendQuery(
    int Months = 12
) : IRequest<IReadOnlyList<MonthlySalesTrendDto>>;