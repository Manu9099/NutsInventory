using NutsInventory.Domain.Common;

namespace NutsInventory.Domain.Entities;

public class AdminUser : AuditableEntity
{
    private AdminUser() { }

    public AdminUser(string email, string fullName, string passwordHash, string role = "Admin")
    {
        Email = email;
        FullName = fullName;
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;
    }

    public string Email { get; private set; } = default!;
    public string FullName { get; private set; } = default!;
    public string PasswordHash { get; private set; } = default!;
    public string Role { get; private set; } = "Admin";
    public bool IsActive { get; private set; }

    public void UpdatePasswordHash(string passwordHash)
    {
        PasswordHash = passwordHash;
        Touch();
    }

    public void Deactivate()
    {
        IsActive = false;
        Touch();
    }
}