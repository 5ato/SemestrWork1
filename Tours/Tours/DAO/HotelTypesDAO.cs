using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class HotelTypesDAO : HasFactory
{
    public List<HotelTypesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);
        return orm.ReadByAll<HotelTypesDTO>("HotelTypes");
    }

    public bool Create(HotelTypesWithoudIdDTO hotelType)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(hotelType, "HotelTypes");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, HotelTypesWithoudIdDTO hotelType)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, hotelType, "HotelTypes");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Delete(int id)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Delete(id, "HotelTypes");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
