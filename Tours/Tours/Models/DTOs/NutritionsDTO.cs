using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class NutritionsWithoudIdDTO
{
    public string Name { get; set; } = string.Empty;
}

public class NutritionsDTO : NutritionsWithoudIdDTO
{
    public int Id { get; set; }
}
