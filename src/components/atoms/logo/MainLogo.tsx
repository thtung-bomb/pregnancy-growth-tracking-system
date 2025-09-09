import { Link } from 'react-router-dom';
import care from '/nestCareLogo.png';

interface MainLogoProps{
     className?: string;
}

const MainLogo = ({className}:MainLogoProps) => {
  return (
    <Link to={"/"}>
        <img  className={className} src={care} alt="" />
    </Link>
  )
}

export default MainLogo