import AboutUs from "../../../components/molecules/about-us/AboutUs"
import CoreValue from "../../../components/organisms/core-value/CoreValue"
import FrequentlyAskedQuestions from "../../../components/organisms/frequently-asked-questions/FrequentlyAskedQuestions"
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import Services from "../../../components/organisms/services/Services"
import Specialties from "../../../components/organisms/specialties/Specialties"

const About = () => {
  return (
    <div className="mx-5">
      <div className="container mx-auto">
        <AboutUs />
        <CoreValue />
        {/* <FrequentlyAskedQuestions /> */}
        {/* <Specialties /> */}
        {/* <Services /> */}
        <LearnMoreAboutNestCare />
      </div>
    </div>
  )
}

export default About
