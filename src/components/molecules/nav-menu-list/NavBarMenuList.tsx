import NavMenu from "../nav-menu/NavMenu";
import PopoverNavList from "../popover-nav-list/PopoverNavList";

const menuItems = [
  { label: "Giới thiệu", hasDropdown: false, link: "/about" },
  // { label: "Chuyên khoa", hasDropdown: true, link: "/specialty" },
  { label: "Dịch vụ", hasDropdown: false, link: "/services" },
  { label: "Bác sĩ", hasDropdown: false, link: "/doctors" },
  { label: "Bài viết", hasDropdown: false, link: "/blog" },
  { label: "Hướng dẫn", hasDropdown: true, link: "" },
  // { label: "Kiến thức", hasDropdown: false, link: "/knowledge" },
  // { label: "Tuyển dụng", hasDropdown: false, link: "/recruitment" },
  { label: "Liên hệ", hasDropdown: false, link: "/contact" },
];


const NavbarMenuList = () => {
  return (
    <div className="flex space-x-5 pl-10">
      {menuItems.map((item, index) => (
        <>
          {
            item.label === "Tin tức" || item.label === "Chuyên khoa" || item.label === "Hướng dẫn"
              ?
              <PopoverNavList title={item.label} link={item.link} />
              :
              <NavMenu key={index} {...item} />
          }
        </>
      ))}
    </div>
  );
};

export default NavbarMenuList;
