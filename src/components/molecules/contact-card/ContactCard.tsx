import { Avatar } from 'antd';
import React, { ReactNode } from 'react'

interface ContactCardProps {
    icon: ReactNode;
    title: string;
    content: string[];
}
const ContactCard = ({ title, content, icon }: ContactCardProps) => {
    return (
        <div style={{height: "350px", width:"300px"}} className='border border-solid p-5 hover:border-red-500'>
            <div className='mt-14'>
                <Avatar size={64} icon={icon} />
            </div>
            <div className='mt-5 font-semibold text-xl'>
                {title}
            </div>
            <div>
                {content.map((item) => (
                    <div className='mt-5'>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContactCard
