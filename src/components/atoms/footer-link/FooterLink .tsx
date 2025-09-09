import { Link } from "react-router-dom";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <div className=" mt-5">
        <Link to={href} className="text-white">
            {children}
        </Link>
    </div>
);
export default FooterLink;