using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class ToursWithoudIdDTO
{
    public DateTime DepartureDate { get; set; }
    public int CountNight { get; set; }
    public decimal Price { get; set; }
    public int AdultCount { get; set; }
    public int ChildCount { get; set; }
    public int HotelId { get; set; }
    public bool IsHot { get; set; }
    public int RussiaCityId { get; set; }
}

public class ToursDTO : ToursWithoudIdDTO
{
    public int Id { get; set; }
}

public class HotToursDTO : ToursDTO
{
    public string CityName { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public string HotelName { get; set; } = string.Empty;
    public int CountStars { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public string RussiaCityName {  get; set; } = string.Empty;
}

public class SelectedServicesDTO
{
    public int Id { get; set; }
    public string TableName {  get; set; } = string.Empty;
}

public class TourFiltersDTO
{
    public int CityId { get; set; }
    public int CountAdults { get; set; }
    public int CountChildren { get; set; }
    public int CountStars { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int StartNight { get; set; }
    public int EndNight { get; set; }
    public int[] SelectedCountries { get; set; }
    public int SelectedNutritions { get; set; }
    public int[] SelectedTypes { get; set; }
    public SelectedServicesDTO[] Services { get; set; }
}

public class TourFilteredDTO
{
    public int Id { get; set; }
    public string CityName { get; set; } = string.Empty;
    public string HotelName {  get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public int CountStars { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class TourDTO : HotToursDTO
{
    public string RoomDescription {  get; set; } = string.Empty;
    public int FoundedYear { get; set; }
    public string LocationDescription { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string NutritionName { get; set; } = string.Empty;
}
