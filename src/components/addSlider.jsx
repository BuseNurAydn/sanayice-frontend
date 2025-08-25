import Slider from "react-slick";

const addBanners = [
  { imageUrl: "https://images.hepsiburada.net/banners/s/1/416-182/gra-199032-appbanner_(1)133988626548332271.jpg/format:webp", linkUrl: "#" },
  { imageUrl: "https://images.hepsiburada.net/banners/s/1/416-182/gra-199032-appbanner_(1)133988626548332271.jpg/format:webp", linkUrl: "#" },
  { imageUrl: "https://images.hepsiburada.net/banners/s/1/416-182/gra-199032-appbanner_(1)133988626548332271.jpg/format:webp", linkUrl: "#" },
];

const AddSlider = () => {
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
        {addBanners.map((banner, i) => (
          <div key={i} className="px-4">
            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.imageUrl}
                alt={`Reklam ${i + 1}`}
                className="w-[424px] h-[185.5px] object-cover rounded-xl shadow"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default AddSlider;

