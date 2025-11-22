using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using Tours.DAO;
using Tours.Models;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class RussiaCitiesAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllCities()
    {
        var data = new RussiaCitiesDAO();

        return Json(data.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateRussiaCity(string name)
    {
        var data = new RussiaCitiesDAO();

        var result = data.Create(new RussiaCitiesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateRussiaCity(int id, string name)
    {
        var data = new RussiaCitiesDAO();

        var result = data.Update(id, new RussiaCitiesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteRussiaCity(int id)
    {
        var data = new RussiaCitiesDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
