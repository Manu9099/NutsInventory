using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Domain.Entities;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Application.Orders.CreateOrder;

public sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreateOrderResponse>
{
    private readonly INutsDbContext _db;

    public CreateOrderCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<CreateOrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        if (request.Items.Count == 0)
            throw new InvalidOperationException("La orden debe tener al menos un item.");

        var customer = await _db.Customers
            .FirstOrDefaultAsync(x => x.Id == request.CustomerId && x.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("Cliente no encontrado.");

        var productIds = request.Items.Select(x => x.ProductId).Distinct().ToList();

        var products = await _db.Products
            .Where(x => productIds.Contains(x.Id) && x.IsActive)
            .ToDictionaryAsync(x => x.Id, cancellationToken);

        if (products.Count != productIds.Count)
            throw new InvalidOperationException("Uno o más productos no existen o están inactivos.");

        var order = new Order(customer.Id, request.Notes);
        decimal grossAmount = 0;

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];

            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Stock insuficiente para {product.Name}.");

            order.AddItem(product.Id, item.Quantity, product.Price);
            grossAmount += product.Price * item.Quantity;
        }

        var maxRedeemablePoints = (int)Math.Floor(grossAmount * 100m);
        var redeemablePoints = Math.Min(request.LoyaltyPointsToRedeem, customer.LoyaltyPoints);
        redeemablePoints = Math.Min(redeemablePoints, maxRedeemablePoints);

        var discountApplied = redeemablePoints / 100m;
        var netAmount = grossAmount - discountApplied;
        var earnedPoints = (int)Math.Floor(netAmount);

        order.FinalizeTotals(discountApplied, earnedPoints);
        order.Confirm();

        await using var tx = await _db.BeginTransactionAsync(cancellationToken);

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(cancellationToken);

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            var previousQty = product.StockQuantity;

            product.DecreaseStock(item.Quantity);

            _db.InventoryMovements.Add(new InventoryMovement(
                product.Id,
                InventoryMovementType.Purchase,
                -item.Quantity,
                previousQty,
                product.StockQuantity,
                $"Venta asociada a orden {order.Id}"
            ));

            var month = DateTime.UtcNow.Month;
            var year = DateTime.UtcNow.Year;
            var itemRevenue = product.Price * item.Quantity;

            var metric = await _db.SalesMetrics.FirstOrDefaultAsync(
                x => x.ProductId == product.Id && x.Month == month && x.Year == year,
                cancellationToken);

            if (metric is null)
            {
                _db.SalesMetrics.Add(SalesMetric.Create(product.Id, month, year, item.Quantity, itemRevenue));
            }
            else
            {
                metric.AddSale(item.Quantity, itemRevenue);
            }
        }

        if (redeemablePoints > 0)
        {
            customer.RedeemPoints(redeemablePoints);
            _db.LoyaltyTransactions.Add(
                new LoyaltyTransaction(customer.Id, -redeemablePoints, LoyaltyReason.Redemption, order.Id));
        }

        customer.RegisterPurchase(netAmount, earnedPoints);
        _db.LoyaltyTransactions.Add(
            new LoyaltyTransaction(customer.Id, earnedPoints, LoyaltyReason.Purchase, order.Id));

        await _db.SaveChangesAsync(cancellationToken);
        await tx.CommitAsync(cancellationToken);

        return new CreateOrderResponse(
            order.Id,
            grossAmount,
            discountApplied,
            netAmount,
            earnedPoints
        );
    }
}