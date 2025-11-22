using System.Net;
using System.Text.Json;

namespace MiniHttpServer.Framework.Core.HttpResponse;

public class ErrorResult : IHttpResult
{
    public string Execute(HttpListenerContext context)
    {
        context.Response.StatusCode = 406;
        context.Response.ContentType = "application/json; charset=utf-8";
        return JsonSerializer.Serialize(new { Status = "Ne ok" });
    }
}
