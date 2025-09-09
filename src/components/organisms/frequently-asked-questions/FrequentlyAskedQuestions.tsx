import BookingNowButton from "../../atoms/button/BookingNowButton"
import Title from "../../atoms/text/Title"
import QuestionCollapse from "../../molecules/question-collapse/QuestionLapse"

const FrequentlyAskedQuestions = () => {
    return (
        <div className="mt-20 grid grid-cols-12 gap-10" id="often_qna">
            <div className="col-span-5">
                <Title text="Câu hỏi thường gặp" />
                <div className="mt-14">
                    Bệnh viện Phụ sản Quốc tế Sài Gòn tiếp nhận khám chữa bệnh với bảo hiểm bảo lãnh viện phí có thẻ đăng ký ban đầu tại mọi cơ sở y tế trên toàn quốc.
                </div>
                <div className="mt-5">
                    <BookingNowButton nameButton="Đặt lịch ngay" />
                </div>
            </div>
            <div className="col-span-7">
                <QuestionCollapse />
            </div>
        </div>
    )
}

export default FrequentlyAskedQuestions
