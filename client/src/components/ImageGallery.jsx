import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../assets/imageGallery.css";

export default function ImageGallery({ images = [] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation={false}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      className="s_Product_carousel"
    >
      {images &&
        images.map((image) => (
          <SwiperSlide key={image.id} className="single-prd-item">
            <img
              className="img-fluid"
              src={image.imagePath}
              alt={image.altText}
              style={{ width: "100%", display: "block" }}
            />
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
