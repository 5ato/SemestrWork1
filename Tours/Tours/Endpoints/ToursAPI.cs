using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class ToursAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllTours()
    {
        var dao = new ToursDAO();

        return Json(dao.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateTour(ToursWithoudIdDTO tour)
    {
        var data = new ToursDAO();

        var result = data.Create(tour);

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateTour(ToursDTO tour)
    {
        var data = new ToursDAO();

        var result = data.Update(
            tour.Id,
            new ToursWithoudIdDTO()
            {
                CountNight = tour.CountNight,
                DepartureDate = tour.DepartureDate,
                AdultCount = tour.AdultCount,
                ChildCount = tour.ChildCount,
                HotelId = tour.HotelId,
                IsHot = tour.IsHot,
                Price = tour.Price,
                RussiaCityId = tour.RussiaCityId,
            });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteTour(int id)
    {
        var data = new ToursDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
