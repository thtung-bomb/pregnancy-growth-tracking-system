import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Title from "../../atoms/text/Title";
import DoctorCardDisplay from "../../molecules/doctor-card";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../../redux/features/doctorsSlice";
import { useEffect } from "react";

const DoctorList = () => {

  const dispatch = useDispatch();
  const doctorsList = useSelector((state) => state.doctor.doctors); // Lấy danh sách bác sĩ từ Redux

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  return (
    <div className="">
      <Title text="Đội ngũ bác sĩ" className="my-10" />
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={4}
        spaceBetween={30}
        pagination={{ clickable: true }}
        className="mySwiper "
        breakpoints={{
          320: { slidesPerView: 1 },  // Điện thoại nhỏ
          768: { slidesPerView: 2 },  // Tablet
          1000: { slidesPerView: 3 }, // Laptop
          1536: { slidesPerView: 4 }, // Màn hình lớn
        }}
      >
        {doctorsList?.map((item, index) => (
          <SwiperSlide key={index} className="justify-items-center">
            {/* <DoctorCard
              professional_qualifications={item.professional_qualifications}
              background_color={index % 2 === 0 ? "pink" : "blue"}
              name={item.name}
              specialty={item.specialty}
              image={item.image}
            /> */}
            <DoctorCardDisplay doctor={item} background_color={index % 2 === 0 ? "pink" : "blue"} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export const doctors = [
  {
    name: "Nguyễn Văn An",
    specialty: "Nội khoa",
    position: "Giám Đốc Y Khoa",
    professional_qualifications: "BS.CK2",
    background_color: "#FFDDC1",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Trần Thị Bình",
    specialty: "Nhi khoa",
    position: "Phó Giám Đốc Y Khoa",
    professional_qualifications: "BS.CK2",
    background_color: "#C1E1FF",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Lê Văn Cường",
    specialty: "Tim mạch",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#E1FFC1",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Phạm Thị Dung",
    specialty: "Sản phụ khoa",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#FFC1E1",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Hoàng Văn Đức",
    specialty: "Chấn thương chỉnh hình",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#FFD700",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Vũ Thị Hạnh",
    specialty: "Da liễu",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#98FB98",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Đinh Văn Khánh",
    specialty: "Tai - Mũi - Họng",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#ADD8E6",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Ngô Thị Lan",
    specialty: "Mắt",
    position: "Trưởng Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#FFB6C1",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Lý Minh Hoàng",
    specialty: "Nội khoa",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#F0E68C",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Trần Thu Hà",
    specialty: "Nhi khoa",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#DDA0DD",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Nguyễn Văn Phúc",
    specialty: "Tim mạch",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#87CEFA",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Lê Thị Như",
    specialty: "Sản phụ khoa",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#FFA07A",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Ngô Văn Tâm",
    specialty: "Chấn thương chỉnh hình",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#20B2AA",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Đào Minh Khang",
    specialty: "Da liễu",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#32CD32",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Lý Thị Vân",
    specialty: "Tai - Mũi - Họng",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#FF4500",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Vũ Ngọc Hiếu",
    specialty: "Mắt",
    position: "Phó Khoa",
    professional_qualifications: "BS.CK1",
    background_color: "#8A2BE2",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Trần Đình Nam",
    specialty: "Nội khoa",
    position: "Bác Sĩ",
    professional_qualifications: "BS.CK1",
    background_color: "#B0C4DE",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Nguyễn Thị Hoa",
    specialty: "Nhi khoa",
    position: "Bác Sĩ",
    professional_qualifications: "BS.CK1",
    background_color: "#FFDAB9",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Phạm Văn Minh",
    specialty: "Tim mạch",
    position: "Bác Sĩ",
    professional_qualifications: "BS.CK1",
    background_color: "#CD5C5C",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  },
  {
    name: "Hoàng Thị Yến",
    specialty: "Sản phụ khoa",
    position: "Bác Sĩ",
    professional_qualifications: "BS.CK1",
    background_color: "#FA8072",
    image: "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"
  }
];

export default DoctorList;
