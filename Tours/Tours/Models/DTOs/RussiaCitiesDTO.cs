using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tours.Models.DTOs;

public class RussiaCitiesWithoudIdDTO
{
    public string Name { get; set; } = string.Empty;
}

public class RussiaCitiesDTO : RussiaCitiesWithoudIdDTO
{
    public int Id { get; set; }
}
