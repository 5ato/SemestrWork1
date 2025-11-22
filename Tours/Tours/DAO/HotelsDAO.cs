
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class HotelsDAO : HasFactory
{
    public List<HotelsDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<HotelsDTO>("Hotels");
    }

    public bool Create(HotelsWithoudIdDTO hotel)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(hotel, "Hotels");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, HotelsWithoudIdDTO hotel)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, hotel, "Hotels");
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
            orm.Delete(id, "Hotels");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
