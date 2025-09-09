import PopoverNavbar from "../../atoms/popover/Popover";

const specialties: InstructProps[] = [
  { title: "Khoa Khám bệnh", link: "/khoa-kham-benh" },
  { title: "Khoa Cấp cứu - Hồi Sức Tích Cực - Chống Độc", link: "/khoa-cap-cuu" },
  { title: "Khoa Sanh", link: "/khoa-sanh" },
  { title: "Khoa Nhi - Sơ Sinh", link: "/khoa-nhi-so-sinh" },
  { title: "Khoa Hiếm muộn vô sinh", link: "/khoa-hiem-muon" },
  { title: "Khoa Phẫu Thuật - Gây mê hồi sức", link: "/khoa-phau-thuat" },
  { title: "Khoa Hậu phẫu hậu sản", link: "/khoa-hau-phau" },
  { title: "Khoa Dinh dưỡng tiết chế", link: "/khoa-dinh-duong" },
  { title: "Khoa Dược - Nhà Thuốc", link: "/khoa-duoc" },
  { title: "Khoa Kế hoạch hóa gia đình", link: "/khoa-ke-hoach-hoa-gia-dinh" },
  { title: "Khối Cận lâm sàng", link: "/khoi-can-lam-sang" },
];

const services: InstructProps[] = [
  { title: "Gói dịch vụ", link: "/services" },
  // { title: "Tất cả dịch vụ", link: "/tat-ca-dich-vu" },
];

const knowledge: InstructProps[] = [
  { title: "Kiến thức Sản - Phụ khoa", link: "/kien-thuc-san-phu-khoa" },
  { title: "Kiến thức Mẹ & Bé", link: "/kien-thuc-me-be" },
  { title: "Kiến thức Tiền hôn nhân", link: "/kien-thuc-tien-hon-nhan" },
  { title: "Kiến thức Hiếm muộn vô sinh", link: "/kien-thuc-hiem-muon" },
];

export interface InstructProps {
  title: string;
  link: string;
}
export const instruct: InstructProps[] = [
  {
    title: "Quy trình khám bệnh NestCare",
    link: "/medical-examination-process",
  },
  {
    title: "Quy trình nhập viện & xuất viện",
    link: "/admission-and-discharge-process",
  },
  {
    title: "Quyền và nghĩa vụ của bệnh nhân",
    link: "/rights-of-patients",
  },
  {
    title: "Chính sách bảo mật NestCare",
    link: "/privacy-policy",
  },
  // {
  //   title: "Thời gian hoạt động và thăm bệnh",
  //   link: "/thoi-gian-hoat-dong-tham-benh",
  // },
  {
    title: "Hướng dẫn thanh toán viện phí",
    link: "/method-of-paying-hospital-fees",
  },
];


const news: InstructProps[] = [
  { title: "Blog", link: "/blog" },
  // { title: "Tin tức NestCare", link: "/tin-tuc-nestcare" },
  // { title: "Thông tin y khoa", link: "/thong-tin-y-khoa" },
  // { title: "Lớp tiền sản", link: "/lop-tien-san" },
  // { title: "Videos", link: "/videos" },
];


interface PopoverNavListProps {
  title: string;
  link: string;
}

const PopoverNavList = ({ title, link }: PopoverNavListProps) => {
  let popContent: InstructProps[];

  switch (title) {
    case "Chuyên khoa":
      popContent = specialties;
      break;
    case "Dịch vụ":
      popContent = services;
      break;
    case "Hướng dẫn":
      popContent = instruct;
      break;
    case "Tin tức":
      popContent = news;
      break;
    default:
      popContent = [];
      break;
  }

  return (
    <div className="">
      <PopoverNavbar
        link={link}
        title={title}
        content={popContent}
      />
    </div>
  );
};

export default PopoverNavList;
