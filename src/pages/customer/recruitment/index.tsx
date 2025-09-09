import RecruitmentInvitation from "../../../components/molecules/recruitment-invitation/RecruitmentInvitation"
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare"
import RecruitmentInfoContainer from "../../../components/organisms/recruitment-info-container/RecruitmentInfoContainer"

const Recruitment = () => {
    return (
        <div className='mx-5'>
            <div className='container mx-auto'>
                <RecruitmentInvitation/>
                <RecruitmentInfoContainer/>
                <LearnMoreAboutNestCare/>
            </div>
        </div>
    )
}

export default Recruitment
