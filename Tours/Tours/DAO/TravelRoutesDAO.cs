
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class TravelRoutesDAO : HasFactory
{
    public List<TravelRoutesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<TravelRoutesDTO>("TravelRoutes");
    }

    public bool Create(TravelRoutesDTO travelRoute)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            string query = $"""
                insert into TravelRoutes (CountryId, RussiaCityId) values
                ({travelRoute.CountryId}, {travelRoute.RussiaCityId})
                """;

            orm.ExecuteNonQuery<TravelRoutesDTO>(query);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(TravelRoutesDTO travelRouteOld, TravelRoutesDTO travelRouteNew)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            string query = $"""
                update TravelRoutes
                set RussiaCityId = {travelRouteNew.RussiaCityId}, CountryId = {travelRouteNew.CountryId}
                where RussiaCityId = {travelRouteOld.RussiaCityId} and CountryId = {travelRouteOld.CountryId}
                """;

            orm.ExecuteNonQuery<TravelRoutesDTO>(query);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Delete(TravelRoutesDTO travelRoute)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            string query = $"""
                delete from TravelRoutes
                where RussiaCityId = {travelRoute.RussiaCityId} and CountryId = {travelRoute.CountryId}
                """;

            orm.ExecuteNonQuery<TravelRoutesDTO>(query);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
