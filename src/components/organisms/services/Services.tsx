import ServicePackage from '../../molecules/service-package'


const Services = () => {
    return (
        <div className='mt-20'>
            <div>
                <ServicePackage
                    image='https://sihospital.com.vn/uploads/202405/21/RWBVJF-dichvunoibat.jpg'
                    name={"Các chuyên khoa"}
                    services={services}
                />
            </div>
        </div>
    )
}

const services = [
    "NHÓM KHÁM",
    "NHÓM SIÊU ÂM",
    "HIẾM MUỘN VÔ SINH",
    "NHÓM SOI",
    "Gói Khám thai"
];

export default Services
