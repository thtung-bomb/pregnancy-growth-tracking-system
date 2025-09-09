import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import DoctorCard from '../../molecules/doctor-card/DoctorCard';
import { doctors } from '../doctor-list/DoctorList';
import { useSelector } from "react-redux";
import DoctorCardDisplay from "../../molecules/doctor-card";
const DoctorsTeam = () => {

    const doctorsList = useSelector((state) => state.doctor.doctors); // Lấy danh sách bác sĩ từ Redux

    const DoctorsFilters = doctors.filter(doctor => doctor.position.includes("Bác Sĩ"))

    return (
        <div className='mt-14'>
            <div className='justify-items-center'>
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                    slidesPerView={4}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    className="mySwiper"
                    breakpoints={{
                        320: { slidesPerView: 1 },  // Điện thoại nhỏ
                        768: { slidesPerView: 2 },  // Tablet
                        1000: { slidesPerView: 3 }, // Laptop
                        1536: { slidesPerView: 4 }, // Màn hình lớn
                    }}
                >
                    {doctorsList.map((item, index) => (
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
        </div>
    )
}

export default DoctorsTeam
