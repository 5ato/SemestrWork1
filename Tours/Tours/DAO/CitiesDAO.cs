using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class CitiesDAO : HasFactory
{
    public List<CitiesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<CitiesDTO>("Cities");
    }

    public bool Create(CitiesWithoudIdDTO city)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(city, "Cities");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, CitiesWithoudIdDTO city)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, city, "Cities");
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
            orm.Delete(id, "Cities");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
