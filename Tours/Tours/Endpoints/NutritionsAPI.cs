using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class NutritionsAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllNutritions()
    {
        var data = new NutritionsDAO();

        return Json(data.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateCity(string name)
    {
        var data = new NutritionsDAO();

        var result = data.Create(new NutritionsWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateCountry(int id, string name)
    {
        var data = new NutritionsDAO();

        var result = data.Update(id, new NutritionsWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteCountry(int id)
    {
        var data = new NutritionsDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
