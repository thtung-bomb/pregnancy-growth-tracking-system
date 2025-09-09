import { Breadcrumb } from "antd";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";
export interface BreadcrumbsProps {
  title: string;
  link?: string;
  className?: string;
}
export interface CustomBreadcrumbsProps {
  items: BreadcrumbsProps[];
  className?: string;
  style?: CSSProperties;
}
const CustomBreadcrumbs = ({ items, className = "", style }: CustomBreadcrumbsProps) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index} className={`${className} `}>
          {item.link ? <Link className={className} to={item.link}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumbs;
