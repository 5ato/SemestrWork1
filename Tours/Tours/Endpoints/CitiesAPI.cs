using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class CitiesAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllCities()
    {
        var data = new CitiesDAO();

        return Json(data.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateCity(string name, int countryId)
    {
        var data = new CitiesDAO();

        var result = data.Create(new CitiesWithoudIdDTO() { Name = name, CountryId = countryId });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateCountry(int id, string name, int countryId)
    {
        var data = new CitiesDAO();

        var result = data.Update(id, new CitiesWithoudIdDTO() { Name = name, CountryId = countryId });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteCountry(int id)
    {
        var data = new CitiesDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
