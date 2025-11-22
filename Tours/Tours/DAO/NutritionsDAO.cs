using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class NutritionsDAO : HasFactory
{
    public List<NutritionsDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<NutritionsDTO>("Nutritions");
    }

    public bool Create(NutritionsWithoudIdDTO nutrition)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(nutrition, "Nutritions");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, NutritionsWithoudIdDTO nutrition)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, nutrition, "Nutritions");
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
            orm.Delete(id, "Nutritions");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
