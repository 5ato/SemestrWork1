using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class CountriesAPI : EndpointBase
{
    [HttpGet("all")]
    public IHttpResult GetAllCountries()
    {
        var data = new CountriesDAO();

        return Json(data.GetAll());
    }

    [HttpGet("city")]
    public IHttpResult GetAllCountriesByCityId(int cityId)
    {
        var data = new CountriesDAO();

        return Json(data.GetByCityId(cityId));
    }

    [HttpPost("create")]
    public IHttpResult CreateCountry(string name)
    {
        var data = new CountriesDAO();

        var result = data.Create(new CountriesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("update")]
    public IHttpResult UpdateCountry(int id, string name)
    {
        var data = new CountriesDAO();

        var result = data.Update(id, new CountriesWithoudIdDTO() { Name = name });

        if (!result)
            return Error();

        return Ok();
    }

    [HttpPost("delete")]
    public IHttpResult DeleteCountry(int id)
    {
        var data = new CountriesDAO();

        var result = data.Delete(id);

        if (!result)
            return Error();

        return Ok();
    }

}
