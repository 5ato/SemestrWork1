using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.DAO;

namespace Tours.Endpoints
{
    [Endpoint]
    public class TourEndpoint : EndpointBase
    {
        [HttpGet]
        public IHttpResult GetTour(int TourId)
        {
            var data = new ToursDAO();
            var daoHotelPhotos = new HotelPhotosDAO();

            var tour = data.GetByIdTour(TourId)!;
            var photos = daoHotelPhotos.GetAllPhotoByHotelId(tour.HotelId);

            return Page("index.html", new { Tour = tour, Photos = photos, Photo = photos.ElementAt(0) });
        }
    }
}
