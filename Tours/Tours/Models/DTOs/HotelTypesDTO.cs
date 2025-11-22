using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class HotelTypesWithoudIdDTO
{
    public string Name { get; set; } = string.Empty;
}

public class HotelTypesDTO : HotelTypesWithoudIdDTO
{
    public int Id { get; set; }
}
