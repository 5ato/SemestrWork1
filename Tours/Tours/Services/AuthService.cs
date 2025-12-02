
using System.Net;

namespace Tours.Services;

public static class AuthService
{
    public static void CreateAuthCookies(string email, string username, HttpListenerContext context)
    {
        Cookie sessionCookie = new Cookie("session_id", email)
        {
            Expires = DateTime.Now.AddDays(1),
            Path = "/"
        };

        Cookie userCookie = new Cookie("username", username)
        {
            Expires = DateTime.Now.AddHours(2),
            Path = "/"
        };

        context.Response.Cookies.Add(sessionCookie);
        context.Response.Cookies.Add(userCookie);
    }
}
