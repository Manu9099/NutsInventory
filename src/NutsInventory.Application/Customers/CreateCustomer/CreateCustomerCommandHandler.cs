using MediatR;
using Microsoft.EntityFrameworkCore;
using NutsInventory.Application.Common.Interfaces;
using NutsInventory.Application.Customers.Common;
using NutsInventory.Domain.Entities;

namespace NutsInventory.Application.Customers.CreateCustomer;

public sealed class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, CustomerDto>
{
    private readonly INutsDbContext _db;

    public CreateCustomerCommandHandler(INutsDbContext db)
    {
        _db = db;
    }

    public async Task<CustomerDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var emailExists = await _db.Customers
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (emailExists)
            throw new InvalidOperationException("Ya existe un cliente con ese email.");

        var customer = new Customer(
            request.Email,
            request.FirstName,
            request.LastName
        );

        // opcional: si luego quieres setters/métodos de dominio para phone/city/address, lo refinamos
        typeof(Customer).GetProperty(nameof(Customer.Phone))?.SetValue(customer, request.Phone);
        typeof(Customer).GetProperty(nameof(Customer.City))?.SetValue(customer, request.City);
        typeof(Customer).GetProperty(nameof(Customer.Address))?.SetValue(customer, request.Address);

        _db.Customers.Add(customer);
        await _db.SaveChangesAsync(cancellationToken);

        return new CustomerDto(
            customer.Id,
            customer.Email,
            customer.FirstName,
            customer.LastName,
            customer.Phone,
            customer.City,
            customer.Address,
            customer.RegisteredAt,
            customer.LastPurchaseDate,
            customer.TotalSpent,
            customer.TotalPurchases,
            customer.LoyaltyPoints,
            customer.Tier.ToString(),
            customer.IsActive
        );
    }
}