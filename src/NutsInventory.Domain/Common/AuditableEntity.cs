namespace NutsInventory.Domain.Common;

public abstract class AuditableEntity
{
    public int Id { get; protected set; }
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }

    public void Touch() => UpdatedAt = DateTime.UtcNow;
}