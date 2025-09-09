import ServicePageCarousel from "../../../components/molecules/service-page-carousel"
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import ServicesPackageList from "../../../components/organisms/services-package-list/ServicesPackageList"

const ServicesPage = () => {
  return (
    <div className="mx-5">
      <div className="container mx-auto">
        <ServicePageCarousel />
        <ServicesPackageList />
        <LearnMoreAboutNestCare />
      </div>
    </div>
  )
}

export default ServicesPage
