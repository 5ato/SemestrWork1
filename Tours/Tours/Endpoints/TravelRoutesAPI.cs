using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class TravelRoutesAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllTravelRoutes()
    {
        var dao = new TravelRoutesDAO();

        return Json(dao.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateTravelRoute(int russiaCityId, int countryId)
    {
        var data = new TravelRoutesDAO();

        var result = data.Create(new TravelRoutesDTO() { RussiaCityId = russiaCityId, CountryId = countryId });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateTravelRoute(int oldRussiaCityId, int oldCountryId, int newRussiaCityId, int newCountryId)
    {
        var data = new TravelRoutesDAO();

        var result = data.Update(
            new TravelRoutesDTO() 
            { CountryId = oldCountryId, RussiaCityId = oldRussiaCityId }, 
            new TravelRoutesDTO() 
            { CountryId = newCountryId, RussiaCityId = newRussiaCityId });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteTravelRoute(int countryId, int russiaCityId)
    {
        var data = new TravelRoutesDAO();

        var result = data.Delete(new TravelRoutesDTO() { CountryId = countryId, RussiaCityId = russiaCityId});

        if (!result)
            return Error();

        return Ok();
    }
}
