import React from 'react'
import FooterLink from '../../atoms/footer-link/FooterLink '

const FooterWorkingTime = () => {
  return (
    <div>
      <div className="">
        <div className='text-white font-semibold'>Thời gian làm việc</div>
        <FooterLink href="/privacy">Cấp cứu 24/24</FooterLink>
        <FooterLink href="/contact">Thứ 2 – CN: 7:00 - 21:00</FooterLink>
        <FooterLink href="/contact">Ngoài giờ: 22:00 - 1:00</FooterLink>
      </div>
    </div>
  )
}

export default FooterWorkingTime