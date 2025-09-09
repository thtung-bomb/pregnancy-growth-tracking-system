import {
  CheckOutlined,
} from '@ant-design/icons';

interface SpecialtyDetailCardProps {
  name: string;
  description: string
  services: string[];
  image: string;
  index: number
}

const SpecialtyDetailCard = ({ name, services, image, description, index }: SpecialtyDetailCardProps) => {
  return (
    <div className={`${index % 2 === 0 ? "bg-pink-50":"bg-yellow-50"} border border-solid rounded-lg p-10  mt-10`}>
      <div className='grid grid-cols-12 gap-10'>
        <div className='col-span-7'>
          <img className='rounded-lg' src={image} alt="" />
        </div>
        <div className='col-span-5'>
          <div className='text-3xl font-semibold'>
            {name}
          </div>
          <div className='text-lg mt-3'>
            {description}
          </div>
          <div className='grid grid-cols-2'>
            {
              services.map((item) => (
                <button type="button" className="mt-5 font-bold text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                  <CheckOutlined className='text-pink-700 font-bold text-lg' />   {item}
                </button>
              ))
            }
          </div>
          <div className='mt-10'>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialtyDetailCard