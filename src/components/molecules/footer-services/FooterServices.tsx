import FooterLink from "../../atoms/footer-link/FooterLink ";

const FooterServices = () => (
    <div className="">
        <div className="text-white font-semibold">Dịch vụ</div>
        <FooterLink href="/services">Gói dịch vụ</FooterLink>
        {/* <FooterLink href="/terms">Tất cả dịch vụ</FooterLink> */}
        <FooterLink href="/contact">Liên hệ</FooterLink>
    </div>
);
export default FooterServices;