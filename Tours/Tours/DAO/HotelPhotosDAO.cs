using MiniHttpServer.Framework.Settings;
using MyORMLibrary;
using Tours.Models.DTOs;

namespace Tours.DAO;

public class HotelPhotosDAO : HasFactory
{
    public IEnumerable<HotelPhotosDTO> GetAllPhotoByHotelId(int HotelId)
    {
        var orm = new ORMContext(connectionFactory);

        return orm.Where<HotelPhotosDTO>(hp => hp.HotelId == HotelId, "HotelPhotos");
    }
}
