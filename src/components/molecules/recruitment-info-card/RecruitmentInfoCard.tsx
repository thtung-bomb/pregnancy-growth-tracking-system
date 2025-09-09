
interface RecruitmentInfoCardProps {
    position: string;
    address: string;
    expiration_date: string;
}

const RecruitmentInfoCard = ({ position, address, expiration_date }: RecruitmentInfoCardProps) => {
    return (
        <div className='border border-solid rounded-xl mt-3 p-3 hover:border-red-500 hover:bg-pink-50 w-[900px]'>
            <div className="text-xl font-semibold">
                {position}
            </div>
            <div>
                Địa điểm: {address} - Ngày hết hạn: {expiration_date}
            </div>
        </div>
    )
}

export default RecruitmentInfoCard
