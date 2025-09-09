import { Avatar } from "antd";
import { ReactNode } from "react";

interface CoreValueCardProps {
    title: string;
    slogan: string;
    icon: ReactNode;
}

const CoreValueCard = ({ title, slogan, icon }: CoreValueCardProps) => {
    return (
        <div className='border border-solid rounded-xl justify-items-center w-96 p-5 text-center'>
            <Avatar style={{backgroundColor: "#b9a3a42e"}} className="mt-2" size={64} icon={icon} />
            <div className="mt-2 text-xl font-semibold">
                {title}
            </div>
            <div className="mt-2">
                {slogan}
            </div>
        </div>
    )
}

export default CoreValueCard