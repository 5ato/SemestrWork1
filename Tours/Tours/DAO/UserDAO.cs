
using MyORMLibrary;
using System.Linq.Expressions;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class UserDAO : HasFactory
{
    public bool CreateUser(UserWithoudIdDTO userDTO)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Create(userDTO, "Users");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
        return true;
    }

    public List<UserDTO> GetAllUser()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<UserDTO>("Users");
    }

    public bool CheckUsernameEmail(UserWithoudIdDTO userDTO)
    {
        var orm = new ORMContext(connectionFactory);

        var data = orm.Where<UserDTO>(u => u.Username == userDTO.Username || u.Email == userDTO.Email, "Users");

        if (data.Any())
        {
            return false;
        }
        return true;
    }

    public UserDTO? GetUserByFilter(Expression<Func<UserDTO, bool>> filter)
    {
        var orm = new ORMContext(connectionFactory);

        return orm.FirstOrDefault(filter, "Users");
    }
}
