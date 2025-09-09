import DoctorCard from '../../molecules/doctor-card/DoctorCard'
import { doctors } from '../doctor-list/DoctorList'

interface DirectorsProps {
  isShowTitle: boolean
}

const Directors = ({ isShowTitle }: DirectorsProps) => {

  return (
    <div>
      {/* {isShowTitle === true &&
        <div className='font-semibold text-xl my-2 '>
          Ban giám đốc y khoa
        </div>
      }
      <div className='justify-items-center'>
        <div className="grid grid-cols-2 gap-5">
          {doctors
            .filter(item => item.position.includes("Giám Đốc"))
            .map((item, index) => (
              <>
                {
                  index === 0 ?
                    <div>
                      <DoctorCard
                        key={item.name}
                        professional_qualifications={item.professional_qualifications}
                        background_color={index % 2 === 1 ? "pink" : "blue"}
                        name={item.name}
                        specialty={item.position}
                        image={item.image}
                      />
                    </div>
                    :
                    <DoctorCard
                      key={item.name}
                      professional_qualifications={item.professional_qualifications}
                      background_color={index % 2 === 1 ? "pink" : "blue"}
                      name={item.name}
                      specialty={item.position}
                      image={item.image}
                    />
                }
              </>
            ))}
        </div>

      </div> */}
    </div>
  )
}

export default Directors
