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

        var servicesSql = "";
        if (filter.Services != null && filter.Services.Length > 0)
        {
            var serviceJoins = new List<string>();

            var beaches = filter.Services.Where(s => s.TableName == "Beaches").Select(s => s.Id).ToList();
            if (beaches.Count > 0)
                serviceJoins.Add($"inner join HotelBeach hb on h.Id = hb.HotelId and hb.ServiceId in ({string.Join(", ", beaches)})");

            var territories = filter.Services.Where(s => s.TableName == "Territories").Select(s => s.Id).ToList();
            if (territories.Count > 0)
                serviceJoins.Add($"inner join HotelTerritory ht on h.Id = ht.HotelId and ht.ServiceId in ({string.Join(", ", territories)})");

            var freeServices = filter.Services.Where(s => s.TableName == "FreeServices").Select(s => s.Id).ToList();
            if (freeServices.Count > 0)
                serviceJoins.Add($"inner join HotelFreeService hfs on h.Id = hfs.HotelId and hfs.ServiceId in ({string.Join(", ", freeServices)})");

            var paidServices = filter.Services.Where(s => s.TableName == "PaidServices").Select(s => s.Id).ToList();
            if (paidServices.Count > 0)
                serviceJoins.Add($"inner join HotelPaidService hps on h.Id = hps.HotelId and hps.ServiceId in ({string.Join(", ", paidServices)})");

            var inRooms = filter.Services.Where(s => s.TableName == "InRooms").Select(s => s.Id).ToList();
            if (inRooms.Count > 0)
                serviceJoins.Add($"inner join HotelInRoom hir on h.Id = hir.HotelId and hir.ServiceId in ({string.Join(", ", inRooms)})");

            servicesSql = string.Join("\n", serviceJoins);
        }

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
            {servicesSql}
            where 
            t.RussiaCityId = {filter.CityId} and t.AdultCount = {filter.CountAdults} and
            t.ChildCount = {filter.CountChildren} and h.CountStars = {filter.CountStars} and
            t.DepartureDate between '{filter.StartDate.ToShortDateString()}' and '{filter.EndDate.ToShortDateString()}' and
            co.Id in ({string.Join(", ", filter.SelectedCountries)}) {nutritionSql} and
            h.HotelTypeId in ({string.Join(", ", filter.SelectedTypes)})
            """;

        var data = orm.ExecuteQueryMultiple<TourFilteredDTO>(query);

        List<TourFilteredDTO> result = new();
        foreach(TourFilteredDTO dto in data)
        {
            dto.ImagePath ??= "images/noImage.jpg";
            result.Add(dto);
        }

        return data;
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
