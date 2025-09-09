import BookingSection from "../../../../components/organisms/booking-section/BookingSection"
import LearnMoreAboutNestCare from "../../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import PrivacyPolicyContainer from "../../../../components/organisms/privacy-policy-container/PrivacyPolicyContainer"

const PrivacyPolicy = () => {
    return (
        <div>
            <div className="mx-5">
                <div className="container mx-auto">
                    <PrivacyPolicyContainer />
                    <BookingSection />
                    <LearnMoreAboutNestCare />
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
