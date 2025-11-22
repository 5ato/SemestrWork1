namespace Tours.Models.DTOs;

public class CitiesWithoudIdDTO
{
    public int CountryId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CitiesDTO : CitiesWithoudIdDTO
{
    public int Id { get; set; }
}
