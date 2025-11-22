
namespace Tours.Models.DTOs;

public class UserWithoudIdDTO
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsAdmin { get; set; }
}

public class UserDTO : UserWithoudIdDTO
{
    public int Id { get; set; }
}


