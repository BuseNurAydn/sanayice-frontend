import Slider from "react-slick";
import { Link } from "react-router-dom";


const AddSlider = ({ banners }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className="my-8 overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner, i) => (
          <div key={i} className="pr-4 w-[424px] h-[185.5px]">
            <Link to={`/kategori/banner/${banner.link}`} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.imageUrl}
                alt={`Reklam ${i + 1}`}
                className="w-full h-auto object-cover rounded-xl shadow"
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AddSlider;

