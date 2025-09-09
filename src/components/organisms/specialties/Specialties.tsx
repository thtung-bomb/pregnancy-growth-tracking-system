import React from 'react'
import ServicePackage from '../../molecules/service-package'

const Specialties = () => {
    return (
        <div className='mt-20'>
            <div>
                <ServicePackage
                image='https://sihospital.com.vn/uploads/202411/45/W3AC9b-z6005077846894-8e58a48f12e941a7d1381c29e40a9329.jpg'
                    name={"Các chuyên khoa"}
                    services={specialties}
                />
            </div>
        </div>
    )
}

const specialties = [
    "Khoa Khám bệnh",
    "Khoa Cấp cứu - Hồi Sức Tích Cực - Chống Độc",
    "Khoa Sanh",
    "Khoa Nhi - Sơ Sinh",
    "Khoa Hiếm muộn vô sinh"
  ];
  
export default Specialties
