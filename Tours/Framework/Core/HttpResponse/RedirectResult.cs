using System.Net;

namespace MiniHttpServer.Framework.Core.HttpResponse;

public class RedirectResult : IHttpResult
{
    private readonly string _url;

    public RedirectResult(string url)
    {
        _url = url;
    }

    public string Execute(HttpListenerContext context)
    {
        context.Response.StatusCode = 302;
        context.Response.RedirectLocation = _url;
        context.Response.Close();
        return "";
    }
}
