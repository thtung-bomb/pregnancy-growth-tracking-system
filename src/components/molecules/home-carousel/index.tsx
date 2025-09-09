import Carousel from "../../atoms/carousel/Carousel";

// Sử dụng component
const images = [
  {
    src: "https://sihospital.com.vn/uploads/202408/34/GoyBFj-banner-web-donghanhcungme.jpg",
    alt: "Banner 1",
  },
  {
    src: "https://sihospital.com.vn/uploads/202405/19/Gtb3Zy-banner-top-3.jpg",
    alt: "Banner 2",
  },
  {
    src: "https://sihospital.com.vn/uploads/202501/00/6sUJyR-banner-web-trangchu-tet.jpg",
    alt: "Banner 3",
  },
  {
    src: "https://sihospital.com.vn/uploads/202411/48/WyeQHo-z6069886499276-de38ee5fafc544594cd857f15239e7c2.jpg",
    alt: "Banner 4",
  },
  {
    src: "https://sihospital.com.vn/uploads/202408/34/LUSFin-banner-web-nhatkydisinh.jpg",
    alt: "Banner 5",
  },
];

const HomeCarousel = () => {
  return (
    <div className="mt-5">
      <Carousel images={images} />
    </div>
  );
};

export default HomeCarousel;
