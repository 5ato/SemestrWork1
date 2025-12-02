using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Tours.DAO;
using Tours.Models.DTOs;

namespace Tours.Endpoints;

[Endpoint]
public class ListTours : EndpointBase
{
    [HttpGet]
    public IHttpResult Index()
    {
        var data = new ToursDAO();

        Console.WriteLine("asdas");

        return Page("index.html", new { HotTours = data.GetAllHotTours() });
    }

    [HttpPost("GetList")]
    public IHttpResult GetListTours(TourFiltersDTO filters)
    {
        var data = new ToursDAO();

        return Json(data.GetAllToursByFilter(filters));
    }
}
