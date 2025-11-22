using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class HotelPhotosDTO
{
    public int Id { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public int HotelId { get; set; }
}
