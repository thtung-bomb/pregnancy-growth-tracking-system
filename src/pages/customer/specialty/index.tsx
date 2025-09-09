
import Title from '../../../components/atoms/text/Title'
import ExpandableCardContainer from '../../../components/molecules/expandable-card-container/ExpandableCardContainer'
import BookingSection from '../../../components/organisms/booking-section/BookingSection'
import Deans from '../../../components/organisms/deans/Deans'
import Directors from '../../../components/organisms/directors/Directors'
import LearnMoreAboutNestCare from '../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare'
import SpecialtiesList from '../../../components/organisms/specialties-list/SecialtyList'
import SpecialtyDetailList from '../../../components/organisms/specialty-detail-list/SpecialtyDetailList'

const Specialty = () => {
    return (
        <div className='mx-5'>
            <div className='mt-20 container mx-auto '>
                <Title text='Các chuyên khoa' />
                <div className='mt-20'>
                    <SpecialtiesList />
                    <ExpandableCardContainer
                        component_name='SpecialtyDetailList'
                        cards={<SpecialtyDetailList />}
                    />
                    <Title text='Đội ngũ bác sĩ' className='my-20' />
                    <div className='mt-8'>
                        <Directors isShowTitle={false} />
                    </div>
                    <Deans isShowTitle={false} />
                    <BookingSection />
                    <LearnMoreAboutNestCare />
                </div>
            </div>
        </div>
    )
}

export default Specialty
