using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class ServicesWithoudIdDTO
{
    public string Type { get; set; } = string.Empty;
}

public class ServicesDTO : ServicesWithoudIdDTO
{
    public int Id { get; set; }
}

public class HotelServiceDTO
{
    public int HotelId { get; set; }
    public int ServiceId { get; set; }
}
