import BookingSection from "../../../components/organisms/booking-section/BookingSection"
import ContactWithUs from "../../../components/organisms/contact-with-us/ContactWithUs"
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"

const Contact = () => {
    return (
        <div className="mx-5">
            <div className="container mx-auto">
                <ContactWithUs />
                <BookingSection/>
                <LearnMoreAboutNestCare/>
            </div>
        </div>
    )
}

export default Contact
