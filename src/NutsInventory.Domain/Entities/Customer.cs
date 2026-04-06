using NutsInventory.Domain.Common;
using NutsInventory.Domain.Enums;

namespace NutsInventory.Domain.Entities;

public class Customer : AuditableEntity
{
    private Customer() { }

    public Customer(string email, string firstName, string lastName)
    {
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        Tier = CustomerTier.Bronze;
        IsActive = true;
    }

    public string Email { get; private set; } = default!;
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;

    public string? Phone { get; private set; }
    public string? City { get; private set; }
    public string? Address { get; private set; }

    public string? PasswordHash { get; private set; }

    public DateTime RegisteredAt { get; private set; } = DateTime.UtcNow;
    public DateTime? LastPurchaseDate { get; private set; }

    public decimal TotalSpent { get; private set; }
    public int TotalPurchases { get; private set; }
    public int LoyaltyPoints { get; private set; }
    public CustomerTier Tier { get; private set; }

    public bool IsActive { get; private set; }

    public bool HasAccount => !string.IsNullOrWhiteSpace(PasswordHash);

    public string FullName => $"{FirstName} {LastName}".Trim();

    public void RegisterPurchase(decimal amount, int earnedPoints)
    {
        if (amount <= 0)
            throw new ArgumentException("El monto debe ser mayor a 0.");

        TotalSpent += amount;
        TotalPurchases++;
        LoyaltyPoints += earnedPoints;
        LastPurchaseDate = DateTime.UtcNow;

        UpdateTier();
        Touch();
    }

    public void RedeemPoints(int points)
    {
        if (points < 0)
            throw new ArgumentException("Los puntos no pueden ser negativos.");

        if (points > LoyaltyPoints)
            throw new InvalidOperationException("Puntos insuficientes.");

        LoyaltyPoints -= points;
        Touch();
    }

    public void UpdateContactInfo(string? phone, string? city, string? address)
    {
        Phone = phone;
        City = city;
        Address = address;
        Touch();
    }

    public void SetPasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("El password hash es obligatorio.");

        PasswordHash = passwordHash;
        Touch();
    }

    public void ClearPasswordHash()
    {
        PasswordHash = null;
        Touch();
    }

    public void Deactivate()
    {
        IsActive = false;
        Touch();
    }

    public void Activate()
    {
        IsActive = true;
        Touch();
    }

    private void UpdateTier()
    {
        Tier = TotalSpent switch
        {
            >= 3000 => CustomerTier.Platinum,
            >= 1500 => CustomerTier.Gold,
            >= 500 => CustomerTier.Silver,
            _ => CustomerTier.Bronze
        };
    }
}