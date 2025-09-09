import { Popover } from 'antd';
import NavMenu from '../../molecules/nav-menu/NavMenu';
import { InstructProps } from '../../molecules/popover-nav-list/PopoverNavList';
import { Link } from 'react-router-dom';

interface PopoverProps {
    content: InstructProps[];
    className?: string;
    title: string;
    link: string;
}
const PopoverNavbar = ({ content, className, title, link }: PopoverProps) => {
    console.log("content: ", content); // Kiểm tra dữ liệu
    const popContents = (
        <div className='mb-3'>
            {
                content.map((item, index) => (
                    <Link to={item.link} key={index}>
                        <> {console.log("item: ", item.title)}</>
                        <div className='font-semibold hover:text-pink-400'>
                            <div className='hover:bg-purple-100 p-2 rounded-lg pl-5 cursor-pointer'>
                                    {item.title}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );

    return (
        <Popover content={popContents} className={className} >
            <div>
                <NavMenu label={title} hasDropdown link={link} />
            </div>
        </Popover>
    );
};

export default PopoverNavbar;