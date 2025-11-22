using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using Tours.DAO;

namespace Tours.Endpoints;

[Endpoint]
public class HotelServicesAPI : EndpointBase
{
    [HttpGet("grouped")]
    public IHttpResult GetAllGroupedServices()
    {
        var data = new HotelServicesDAO();

        return Json(data.GetAllGroups());
    }
}
