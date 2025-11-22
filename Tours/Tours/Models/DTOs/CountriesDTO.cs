namespace Tours.Models.DTOs;


public class CountriesWithoudIdDTO
{
    public string Name { get; set; } = string.Empty;
}

public class CountriesDTO : CountriesWithoudIdDTO
{
    public int Id { get; set; }
}
