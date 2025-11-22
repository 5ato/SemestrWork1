using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class HotelsAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllHotels()
    {
        var dao = new HotelsDAO();

        return Json(dao.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateHotel(HotelsWithoudIdDTO hotel)
    {
        var data = new HotelsDAO();

        var result = data.Create(hotel);

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateHotel(HotelsDTO hotel)
    {
        var data = new HotelsDAO();

        var result = data.Update(hotel.Id, new HotelsWithoudIdDTO()
        {
            Name = hotel.Name,
            Address = hotel.Address,
            CityId = hotel.CityId,
            LocationDescription = hotel.LocationDescription,
            CountStars = hotel.CountStars,
            RoomDescription = hotel.RoomDescription,
            FoundedYear = hotel.FoundedYear,
            HotelTypeId = hotel.HotelTypeId,
            NutritionId = hotel.NutritionId,
        });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteHotel(int id)
    {
        var data = new HotelsDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
