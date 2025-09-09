import { Link } from "react-router-dom";
import Text from "../../atoms/text/Text";
import {
  DownOutlined
} from '@ant-design/icons';
interface NavMenuProps {
  label: string;
  hasDropdown?: boolean;
  className?: string;
  link: string;
  onClick?: () => void;
}

const NavMenu = ({ label, hasDropdown, className, link }: NavMenuProps) => {
  return (
    <div className={`${className} hover:bg-pink-100 p-2 rounded-xl`}>
      <Link to={link}>
        <Text>{label} {hasDropdown && <DownOutlined />}</Text>
      </Link>
    </div>
  )
};

export default NavMenu;
