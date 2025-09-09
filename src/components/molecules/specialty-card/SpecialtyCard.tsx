import { Avatar } from 'antd'
import { ReactNode } from 'react'
interface SpecialtyCardProps{
    icon: ReactNode;
    title: string;
}

const SpecialtyCard = ({icon, title}: SpecialtyCardProps) => {
  return (
    <div style={{width: "350px", height: "200px"}} className='border border-solid p-5 rounded-xl hover:text-red-500 hover:bg-pink-50'>
      <div className='mt-3'>
        <Avatar icon={icon} size={64}/>
      </div>
      <div className='text-xl font-semibold mt-3'>
        {title}
      </div>
    </div>
  )
}

export default SpecialtyCard
