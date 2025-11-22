using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class RussiaCitiesDAO : HasFactory
{
    public  List<RussiaCitiesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);
        return orm.ReadByAll<RussiaCitiesDTO>("RussiaCities");
    }

    public bool Create(RussiaCitiesWithoudIdDTO country)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(country, "RussiaCities");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, RussiaCitiesWithoudIdDTO country)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, country, "RussiaCities");
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
            orm.Delete(id, "RussiaCities");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
