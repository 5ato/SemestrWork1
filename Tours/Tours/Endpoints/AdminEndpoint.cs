using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using MyORMLibrary;
using System.Net;
using Tours.DAO;
using Tours.Models.DTOs;
using Tours.Services;


namespace Tours.Endpoints;

[Endpoint]
public class AdminEndpoint : EndpointBase
{
    private bool IsAdminUser()
    {
        Cookie? cookie = Context.Request.Cookies["session_id"];

        if (cookie == null) return false;

        var email = cookie.Value;
        var dao = new UserDAO();
        var user = dao.GetUserByFilter(u => u.Email == email);

        return user?.IsAdmin == true;
    }

    private IHttpResult AdminPageOrRedirect(string pageName)
    {
        return IsAdminUser()
            ? Page(pageName, new { })
            : Redirect("/ListTours");
    }


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
            AuthService.CreateAuthCookies(user.Email, user.Username, Context);
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
            AuthService.CreateAuthCookies(userDTO.Email, userDTO.Username, Context);
        }

        return userDTO.IsAdmin
            ? Redirect("AdminEndpoint/AdminPanel")
            : Redirect("/ListTours");
    }

    [HttpGet("AdminPanel")]
    public IHttpResult GetAdminPanel() => AdminPageOrRedirect("panel.html");
 
    [HttpGet("AdminCUDHotel")]
    public IHttpResult CUDHotel() => AdminPageOrRedirect("CUDHotel.html");

    [HttpGet("AdminCUDTour")]
    public IHttpResult CUDTour() => AdminPageOrRedirect("CUDTour.html");

    [HttpGet("AdminCUDNutrition")]
    public IHttpResult CUDNutrition() => AdminPageOrRedirect("CUDNutrition.html");

    [HttpGet("AdminCUDRussiaCity")]
    public IHttpResult CUDRussiaCity() => AdminPageOrRedirect("CUDRussiaCity.html");

    [HttpGet("AdminCUDCountry")]
    public IHttpResult CUDCountry() => AdminPageOrRedirect("CUDCountry.html");

    [HttpGet("AdminCUDCity")]
    public IHttpResult CUDCity() => AdminPageOrRedirect("CUDCity.html");

    [HttpGet("AdminCUDHotelType")]
    public IHttpResult CUDHotelType() => AdminPageOrRedirect("CUDHotelType.html");

    [HttpGet("AdminCUDHotelServices")]
    public IHttpResult CUDHotelServices() => AdminPageOrRedirect("CUDHotelServices.html");
}
