using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class HotelServicesDAO : HasFactory
{
    public List<ServicesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        var beaches = orm.ReadByAll<ServicesDTO>("Beaches");
        var territories = orm.ReadByAll<ServicesDTO>("Territories");
        var freeServices = orm.ReadByAll<ServicesDTO>("FreeServices");
        var paidServices = orm.ReadByAll<ServicesDTO>("PaidServices");
        var inRooms = orm.ReadByAll<ServicesDTO>("InRooms");


        return orm.ReadByAll<ServicesDTO>("");
    }

    public List<ServicesDTO> GetAllByServices(string serviceName)
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<ServicesDTO>(serviceName);
    }

    public List<HotelServiceDTO> GetAllByHotelService(string hotelServiceName)
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<HotelServiceDTO>(hotelServiceName);
    }

    public Dictionary<string, List<ServicesDTO>> GetAllGroups()
    {
        var orm = new ORMContext(connectionFactory);

        var beaches = orm.ReadByAll<ServicesDTO>("Beaches");
        var territories = orm.ReadByAll<ServicesDTO>("Territories");
        var freeServices = orm.ReadByAll<ServicesDTO>("FreeServices");
        var paidServices = orm.ReadByAll<ServicesDTO>("PaidServices");
        var inRooms = orm.ReadByAll<ServicesDTO>("InRooms");

        return new Dictionary<string, List<ServicesDTO>>()
        {
            { "Beaches", beaches },
            { "Territories", territories },
            { "FreeServices", freeServices },
            { "PaidServices", paidServices },
            { "InRooms", inRooms },
        };
    }

    public bool CreateService(string serviceName, ServicesWithoudIdDTO service)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(service, serviceName);
        }
        catch (Exception)
        {
            return false;
        }

        return true;
    }

    public bool UpdateService(string serviceName, int id, ServicesWithoudIdDTO service)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, service, serviceName);
        }
        catch (Exception)
        {
            return false;
        }
        return true;
    }

    public bool DeleteService(string serviceName, int id)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Delete(id, serviceName);
        }
        catch (Exception)
        {
            return false;
        }
        return true;
    }

    public bool CreateHotelService(HotelServiceDTO hotelServiceDTO, string tableName)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(hotelServiceDTO, tableName);
        }
        catch (Exception)
        {
            return false;
        }

        return true;
    }

    public bool DeleteHotelService(HotelServiceDTO hotelServiceDTO, string tableName)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.ExecuteNonQuery<HotelServiceDTO>($"""
                delete from {tableName} 
                where hotelid = {hotelServiceDTO.HotelId} and serviceid = {hotelServiceDTO.ServiceId}
                """);
        }
        catch (Exception)
        {
            return false;
        }
        return true;
    }
}
