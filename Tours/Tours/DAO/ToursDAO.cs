using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class ToursDAO : HasFactory
{
    public List<ToursDTO> GetAll()
    {
        var orm = new ORMContext(connectionFactory);

        return orm.ReadByAll<ToursDTO>("Tours");
    }

    public IEnumerable<TourFilteredDTO> GetAllToursByFilter(TourFiltersDTO filter)
    {
        var orm = new ORMContext(connectionFactory);

        var nutritionSql = "";

        if (filter.SelectedNutritions != -1)
            nutritionSql = $"and h.NutritionId = {filter.SelectedNutritions}";

        string query = $"""
            select t.Id, t.Price, 
            c.Name as "CityName",
            h.Name as "HotelName", h.CountStars as "CountStars", h.Description as "Description",
            co.Name as "CountryName" ,
            hp.ImagePath as "ImagePath"
            from Tours as t
            inner join Hotels as h on t.HotelId = h.id
            inner join Cities as c on h.CityId = c.id
            inner join Countries as co on c.countryId = co.id
            left join (
             select HotelId, ImagePath,
             ROW_NUMBER() over (partition by HotelId order by Id) as rn
             from HotelPhotos
            ) as hp on h.Id = hp.HotelId and hp.rn = 1
            where 
            t.RussiaCityId = {filter.CityId} and t.AdultCount = {filter.CountAdults} and
            t.ChildCount = {filter.CountChildren} and h.CountStars = {filter.CountStars} and
            t.DepartureDate between '{filter.StartDate.ToShortDateString()}' and '{filter.EndDate.ToShortDateString()}' and
            co.Id in ({string.Join(", ", filter.SelectedCountries)}) {nutritionSql} and
            h.HotelTypeId in ({string.Join(", ", filter.SelectedTypes)})
            """;

        return orm.ExecuteQueryMultiple<TourFilteredDTO>(query);
    }

    public IEnumerable<HotToursDTO> GetAllHotTours()
    {
        var orm = new ORMContext(connectionFactory);
        string query = """
            select t.Id, t.DepartureDate, t.CountNight, t.Price, t.AdultCount, t.ChildCount, t.IsHot, 
            c.Name as "CityName",
            h.Name as "HotelName", h.CountStars as "CountStars", 
            co.Name as "CountryName" ,
            hp.ImagePath as "ImagePath",
            rc.Name as "RussiaCityName"
            from Tours as t
            inner join Hotels as h on t.HotelId = h.id
            inner join Cities as c on h.CityId = c.id
            inner join Countries as co on c.countryId = co.id
            inner join RussiaCities as rc on t.RussiaCityId = rc.Id
            left join (
                select HotelId, ImagePath,
                ROW_NUMBER() over (partition by HotelId order by Id) as rn
                from HotelPhotos
            ) as hp on h.Id = hp.HotelId and hp.rn = 1
            where t.IsHot = true
            """;

        return orm.ExecuteQueryMultiple<HotToursDTO>(query);
    }

    public TourDTO? GetByIdTour(int id)
    {
        var orm = new ORMContext(connectionFactory);
        string query = $"""
            select t.Id, t.DepartureDate, t.CountNight, t.Price, t.AdultCount, t.ChildCount, 
            c.Name as "CityName",
            h.Name as "HotelName", h.CountStars as "CountStars", h.RoomDescription as "RoomDescription", 
            h.FoundedYear as "FoundedYear", h.LocationDescription as "LocationDescription", 
            h.Address as "Address", h.Description as "Description", h.Id as "HotelId",
            n.Name as "NutritionName",
            co.Name as "CountryName" ,
            rc.Name as "RussiaCityName"
            from Tours as t
            inner join Hotels as h on t.HotelId = h.id
            inner join Cities as c on h.CityId = c.id
            inner join Countries as co on c.countryId = co.id
            inner join RussiaCities as rc on t.RussiaCityId = rc.Id
            inner join Nutritions as n on n.Id = h.NutritionId
            where t.Id = {id}
            """;

        return orm.ExecuteQuerySingle<TourDTO>(query);
    }

    public bool Create(ToursWithoudIdDTO tour)
    {
        var orm = new ORMContext(connectionFactory);

        try
        {
            orm.Create(tour, "Tours");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }

    public bool Update(int id, ToursWithoudIdDTO tour)
    {
        var orm = new ORMContext(connectionFactory);
        try
        {
            orm.Update(id, tour, "Tours");
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
            orm.Delete(id, "Tours");
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return false;
        }
        return true;
    }
}
