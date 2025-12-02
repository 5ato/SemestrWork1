using MiniHttpServer.Framework.Core;
using MiniHttpServer.Framework.Core.Attributes;
using MiniHttpServer.Framework.Core.HttpResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tours.DAO;
using Tours.Models.DTOs;

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

            var tour = data.GetByIdTour(TourId);

            if (tour == null)
            {
                return NotFounded();
            }

            var photos = daoHotelPhotos.GetAllPhotoByHotelId(tour.HotelId);

            if (!photos.Any())
                photos = new List<HotelPhotosDTO>() { new HotelPhotosDTO()
                    {
                        HotelId = TourId,
                        ImagePath = "images/noImage.jpg",
                        Id = -1
                    }
                };

            return Page("index.html", new { Tour = tour, Photos = photos, Photo = photos.ElementAt(0) });
        }
    }
}
