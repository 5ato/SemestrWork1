
using System.Net;

namespace MiniHttpServer.Framework.Core.HttpResponse;

public class NotFounded : IHttpResult
{
    public string Execute(HttpListenerContext context)
    {
        context.Response.StatusCode = (int)HttpStatusCode.NotFound;
        context.Response.ContentType = "text/html; charset=utf-8";
        return "public/404.html";
    }
}
