import BookingSection from "../../../../components/organisms/booking-section/BookingSection"
import LearnMoreAboutNestCare from "../../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import MedicalExaminationProcessContainer from "../../../../components/organisms/medical-examination-process-container/MedicalExaminationProcessContainer"

const MedicalExaminationProcess = () => {
  return (
    <div className="mx-5">
      <div className="container mx-auto">
            <MedicalExaminationProcessContainer/>
            <BookingSection/>
            <LearnMoreAboutNestCare/>
      </div>
    </div>
  )
}

export default MedicalExaminationProcess
