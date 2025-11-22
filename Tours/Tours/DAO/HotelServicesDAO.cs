using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class HotelServicesDAO : HasFactory
{
    public List<HotelServicesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        var beaches = orm.ReadByAll<HotelServicesDTO>("Beaches");
        var territories = orm.ReadByAll<HotelServicesDTO>("Territories");
        var freeServices = orm.ReadByAll<HotelServicesDTO>("FreeServices");
        var paidServices = orm.ReadByAll<HotelServicesDTO>("PaidServices");
        var inRooms = orm.ReadByAll<HotelServicesDTO>("InRooms");


        return orm.ReadByAll<HotelServicesDTO>("");
    }

    public Dictionary<string, List<HotelServicesDTO>> GetAllGroups()
    {
        var orm = new ORMContext(connectionFactory);

        var beaches = orm.ReadByAll<HotelServicesDTO>("Beaches");
        var territories = orm.ReadByAll<HotelServicesDTO>("Territories");
        var freeServices = orm.ReadByAll<HotelServicesDTO>("FreeServices");
        var paidServices = orm.ReadByAll<HotelServicesDTO>("PaidServices");
        var inRooms = orm.ReadByAll<HotelServicesDTO>("InRooms");

        return new Dictionary<string, List<HotelServicesDTO>>()
        {
            { "Beaches", beaches },
            { "Territories", territories },
            { "FreeServices", freeServices },
            { "PaidServices", paidServices },
            { "InRooms", inRooms },
        };
    }
}
