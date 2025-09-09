import BookingSection from '../../../../components/organisms/booking-section/BookingSection'
import LearnMoreAboutNestCare from '../../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare'
import MethodOfPayingHospitalFeedsContainer from '../../../../components/organisms/method-of-paying-hospital-fees-container/MethodOfPayingHospitalFeedsContainer'

const MethodOfPayingHospitalFees = () => {
    return (
        <div>
            <div className="mx-5">
                <div className="container mx-auto">
                    <MethodOfPayingHospitalFeedsContainer />
                    <BookingSection />
                    <LearnMoreAboutNestCare />
                </div>
            </div>
        </div>
    )
}

export default MethodOfPayingHospitalFees
