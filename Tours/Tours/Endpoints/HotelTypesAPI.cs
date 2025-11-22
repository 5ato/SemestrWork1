using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class HotelTypesAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllHotelTypes()
    {
        var data = new HotelTypesDAO();

        return Json(data.GetAll());
    }

    [HttpPost("create")]
    public IHttpResult CreateCountry(string name)
    {
        var data = new HotelTypesDAO();

        var result = data.Create(new HotelTypesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateCountry(int id, string name)
    {
        var data = new HotelTypesDAO();

        var result = data.Update(id, new HotelTypesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteCountry(int id)
    {
        var data = new HotelTypesDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }
}
