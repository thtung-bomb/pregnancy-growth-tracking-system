import DoctorCard from '../../molecules/doctor-card/DoctorCard'
import { doctors } from '../doctor-list/DoctorList'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

interface DeansProps {
    isShowTitle: boolean
}

const Deans = ({ isShowTitle }: DeansProps) => {
    const DoctorsFilters = doctors.filter(doctor => doctor.position.includes("Trưởng Khoa") || doctor.position.includes("Phó Khoa"))
    return (
        <div className='mt-14'>
            {/* {isShowTitle === true &&
                <div className='font-semibold text-xl my-2'>
                    Trưởng, phó khoa/phòng
                </div>
            }
            <div className='justify-items-center'>
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
                    {DoctorsFilters.map((item, index) => (
                        <SwiperSlide key={index} className="justify-items-center">
                            <DoctorCard
                                professional_qualifications={item.professional_qualifications}
                                background_color={index % 2 === 0 ? "pink" : "blue"}
                                name={item.name}
                                specialty={item.specialty}
                                image={item.image}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div> */}
        </div>
    )
}

export default Deans
