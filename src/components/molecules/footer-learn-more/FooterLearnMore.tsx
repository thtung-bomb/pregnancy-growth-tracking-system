import FooterLink from '../../atoms/footer-link/FooterLink '

const FooterLearnMore = () => {
  return (
    <div>
      <div className="">
        <div className='text-white font-semibold'>Tìm hiểu thêm</div>
        <FooterLink href="/about">Về NestCare</FooterLink>
        <FooterLink href="/doctors">Đội ngũ bác sĩ</FooterLink>
        <FooterLink href="/contact">Câu hỏi thường gặp</FooterLink>
        <FooterLink href="/contact">Tuyển dụng</FooterLink>
      </div>
    </div>
  )
}

export default FooterLearnMore