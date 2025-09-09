import BookingSection from "../../../../components/organisms/booking-section/BookingSection"
import LearnMoreAboutNestCare from "../../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import AddmissionAndDischargeProcessContainer from "../../../../components/organisms/admission_and_discharge_process_container/AdmissionAndDischargeProcessContainer"
const AdmissionAndDischargeProcess = () => {
    return (
        <div className='mx-5'>
            <div className='container mx-auto'>
                <AddmissionAndDischargeProcessContainer />
                <BookingSection />
                <LearnMoreAboutNestCare/>
            </div>
        </div>
    )
}

export default AdmissionAndDischargeProcess
