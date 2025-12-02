using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class HotelServicesAPI : EndpointBase
{
    [HttpGet("grouped")]
    public IHttpResult GetAllGroupedServices()
    {
        var dao = new HotelServicesDAO();

        return Json(dao.GetAllGroups());
    }

    [HttpGet("GetServices")]
    public IHttpResult GetService(string serviceName)
    {
        var dao = new HotelServicesDAO();

        return Json(dao.GetAllByServices(serviceName));
    }

    [HttpGet("GetHotelService")]
    public IHttpResult GetHotelService(string hotelServiceName)
    {
        var dao = new HotelServicesDAO();

        return Json(dao.GetAllByHotelService(hotelServiceName));
    }

    [HttpPost("CreateHotelService")]
    public IHttpResult CreateHotelService(int hotelId, int serviceId, string tableName)
    {
        var dao = new HotelServicesDAO();
        bool result = dao.CreateHotelService(new HotelServiceDTO()
        {
            HotelId = hotelId,
            ServiceId = serviceId
        },
        tableName);

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("DeleteHotelService")]
    public IHttpResult DeleteHotelService(int hotelId, int serviceId, string tableName)
    {
        var dao = new HotelServicesDAO();
        bool result = dao.DeleteHotelService(new HotelServiceDTO()
        {
            HotelId = hotelId,
            ServiceId = serviceId
        },
        tableName);

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("CreateService")]
    public IHttpResult CreateService(string serviceName, string type)
    {
        var dao = new HotelServicesDAO();

        bool result = dao.CreateService(serviceName, new ServicesWithoudIdDTO()
        {
            Type = type
        });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("UpdateService")]
    public IHttpResult UpdateService(string serviceName, string type, int id)
    {
        var dao = new HotelServicesDAO();

        bool result = dao.UpdateService(serviceName, id, new ServicesWithoudIdDTO()
        {
            Type = type
        });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("DeleteService")]
    public IHttpResult DeleteService(string serviceName, int id)
    {
        var dao = new HotelServicesDAO();

        bool result = dao.DeleteService(serviceName, id);

        if (!result)
            return Error();

        return Ok();
    }
}
