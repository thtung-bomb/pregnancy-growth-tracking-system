import BookingSection from "../../../../components/organisms/booking-section/BookingSection"
import LearnMoreAboutNestCare from "../../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import RightsOfPaitentsContainer from "../../../../components/organisms/rights-of-paitents-container/RightsOfPaitentsContainer"


const RightsOfPaitents = () => {
    return (
        <div>
            <div className="mx-5">
                <div className="container mx-auto">
                    <RightsOfPaitentsContainer />
                    <BookingSection />
                    <LearnMoreAboutNestCare />
                </div>
            </div>
        </div>
    )
}

export default RightsOfPaitents
