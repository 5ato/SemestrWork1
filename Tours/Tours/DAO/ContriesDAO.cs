using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class CountriesDAO : HasFactory
{
    public List<CountriesDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);
        return orm.ReadByAll<CountriesDTO>("Countries");
    }

    public IEnumerable<CountriesDTO> GetByCityId(int cityId)
    {
        var orm = new ORMContext(connectionFactory);

        string query = $"""
            select c.Id, c.Name from Countries as c
            inner join TravelRoutes as tr on tr.CountryId = c.id
            where tr.RussiaCityId = {cityId}
            """;

        return orm.ExecuteQueryMultiple<CountriesDTO>(query);
    }

    public bool Create(CountriesWithoudIdDTO country)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(country, "Countries");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, CountriesWithoudIdDTO country)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, country, "Countries");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Delete(int id)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Delete(id, "Countries");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
