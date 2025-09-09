import React from 'react'
import Title from '../../atoms/text/Title'
import Address from '../../molecules/contact-method/Address'
import HotLine from '../../molecules/contact-method/HotLine'
import WorkingTime from '../../molecules/contact-method/WorkingTime'
import Email from '../../molecules/contact-method/Email'

const ContactWithUs = () => {
    return (
        <div className=''>
            <Title className='my-20' text='Liên hệ với chúng tôi' />
            <div className=' grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 justify-items-center'>
                <Address />
                <HotLine />
                <WorkingTime/>
                <Email/>
            </div>
        </div>
    )
}

export default ContactWithUs
