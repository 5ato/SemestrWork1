using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;


public class HotelsWithoudIdDTO
{
    public string Name { get; set; } = string.Empty;
    public string RoomDescription { get; set; } = string.Empty;
    public int FoundedYear { get; set; }
    public int NutritionId { get; set; }
    public string LocationDescription { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int CountStars { get; set; }
    public int CityId { get; set; }
    public int HotelTypeId { get; set; }
}

public class HotelsDTO : HotelsWithoudIdDTO
{
    public int Id { get; set; }
}

public class HotelsWithNutritionsAndTypes : HotelsDTO
{
    public string NutritionName { get; set; } = string.Empty;
    public string HotelTypesName {  get; set; } = string.Empty;
}
