import Title from "../../../components/atoms/text/Title"
import BookingSection from "../../../components/organisms/booking-section/BookingSection"
import Deans from "../../../components/organisms/deans/Deans"
import Directors from "../../../components/organisms/directors/Directors"
import DoctorsTeam from "../../../components/organisms/doctors-team/DoctorsTeam"
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import OutStandingService from "../../../components/organisms/outstanding-service/OutStandingService"

const TeamOfDoctor = () => {
  return (
    <div className="mx-5">
      <div className="container mx-auto">
        <Title className="my-20" text="Đội ngũ bác sĩ" />
        <Directors isShowTitle={true}/>
        <Deans isShowTitle={true}/>
        <DoctorsTeam/>
        <BookingSection/>
        <OutStandingService/>
        <LearnMoreAboutNestCare/>
      </div>
    </div>
  )
}

export default TeamOfDoctor
