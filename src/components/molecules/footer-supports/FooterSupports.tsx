import React from 'react'
import FooterLink from '../../atoms/footer-link/FooterLink '

const FooterSupports = () => {
  return (
    <div>
      <div className="">
        <div className='text-white font-semibold'>Hỗ trợ khách hàng</div>
        <FooterLink href="/#">Quyền của bệnh nhân</FooterLink>
        <FooterLink href="/#">Chính sách bảo mật</FooterLink>
        <FooterLink href="/#">Chính sách bảo mật thông tin</FooterLink>
        <FooterLink href="/#">Liên hệ</FooterLink>
      </div>
    </div>
  )
}

export default FooterSupports