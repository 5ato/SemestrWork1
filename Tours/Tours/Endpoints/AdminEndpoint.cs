using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using MyORMLibrary;
using System.Net;
using Tours.DAO;
using Tours.Models.DTOs;


namespace Tours.Endpoints;

[Endpoint]
public class AdminEndpoint : EndpointBase
{
    [HttpGet("login")]
    public IHttpResult LoginIndex()
    {
        return Page("index.html", new { HasError = false });
    }

    [HttpPost("login")]
    public IHttpResult AuthLogin(string email, string password)
    {
        var dao = new UserDAO();

        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null || user.Password != password)
        {
            return Page("index.html", new { HasError = true, Message = "Ошибка ввода"});
        }

        Cookie? cookie = Context.Request.Cookies["session_id"];
        if (cookie == null)
        {
            // Создаем куки
            Cookie sessionCookie = new Cookie("session_id", user.Email)
            {
                Expires = DateTime.Now.AddDays(1),
                Path = "/"
            };

            Cookie userCookie = new Cookie("username", user.Username)
            {
                Expires = DateTime.Now.AddHours(2),
                Path = "/"
            };

            var response = Context.Response;

            // Добавляем куки в ответ
            response.Cookies.Add(sessionCookie);
            response.Cookies.Add(userCookie);
        }

        if (user.IsAdmin)
            return Redirect("/AdminEndpoint/AdminPanel");

        return Redirect("/ListTours");
    }

    [HttpGet("register")]
    public IHttpResult RegisterIndex()
    {
        return Page("register.html", new { HasError = false });
    }

    [HttpPost("register")]
    public IHttpResult AuthRegister(string fullName, string email, string password)
    {
        var dao = new UserDAO();

        var userDTO = new UserWithoudIdDTO()
        {
            Username = fullName,
            Email = email,
            Password = password,
            IsActive = true,
            CreatedAt = DateTime.Now,
            IsAdmin = true,
        };

        if (!dao.CheckUsernameEmail(userDTO))
        {
            return Page("register.html", new { HasError = true, Message = "Пользователь с таким Email или Username уже существует" });
        }

        var resultCreate = dao.CreateUser(userDTO);

        if (!resultCreate)
        {
            return Page("register.html", new { HasError = true, Message = "Что-то пошло не так, попробуйте позже" });
        }

        Cookie? cookie = Context.Request.Cookies["session_id"];
        if (cookie == null)
        {
            // Создаем куки
            Cookie sessionCookie = new Cookie("session_id", userDTO.Email)
            {
                Expires = DateTime.Now.AddDays(1),
                Path = "/"
            };

            Cookie userCookie = new Cookie("username", userDTO.Username)
            {
                Expires = DateTime.Now.AddHours(2),
                Path = "/"
            };

            var response = Context.Response;

            // Добавляем куки в ответ
            response.Cookies.Add(sessionCookie);
            response.Cookies.Add(userCookie);
        }

        if (userDTO.IsAdmin)
            return Redirect("/AdminEndpoint/AdminPanel");

        return Redirect("/ListTours");
    }

    [HttpGet("AdminPanel")]
    public IHttpResult GetAdminPanel()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("panel.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDHotel")]
    public IHttpResult CUDHotel()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDHotel.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDTour")]
    public IHttpResult CUDTour()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDTour.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDNutrition")]
    public IHttpResult CUDNutrition()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDNutrition.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDRussiaCity")]
    public IHttpResult CUDRussiaCity()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDRussiaCity.html", new { });

        return Redirect("/ListTours");
    }


    [HttpGet("AdminCUDCountry")]
    public IHttpResult CUDCountry()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDCountry.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDCity")]
    public IHttpResult CUDCity()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDCity.html", new { });

        return Redirect("/ListTours");
    }

    [HttpGet("AdminCUDHotelType")]
    public IHttpResult CUDHotelType()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null)
            return Redirect("/AdminEndpoint/login");

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        if (user == null)
            return Redirect("/ListTours");

        if (user.IsAdmin)
            return Page("CUDHotelType.html", new { });

        return Redirect("/ListTours");
    }
}
