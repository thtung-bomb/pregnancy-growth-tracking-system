import MainLogo from "../../atoms/logo/MainLogo"
import HospitalName from "../../atoms/text/HospitalName"
import Title from "../../atoms/text/Title"
import FooterInfo from "../../molecules/footer-info/FooterInfo"
import FooterLearnMore from "../../molecules/footer-learn-more/FooterLearnMore"
import FooterServices from "../../molecules/footer-services/FooterServices"
import FooterSupports from "../../molecules/footer-supports/FooterSupports"
import FooterWorkingTime from "../../molecules/footer-working-time/FooterWorkingTime"

const Footer = () => {
    return (
        <div className="bg-zinc-700 mt-10 py-14">
            <div className="container mx-auto">
                <div className="flex ">
                    <MainLogo className="w-[100px] h-[100px]" />
                    <HospitalName className="flex items-center ml-5"/>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    <FooterInfo />
                    <FooterServices />
                    <FooterLearnMore />
                    <FooterSupports />
                    <FooterWorkingTime />
                </div>
            </div>
        </div>
    )
}

export default Footer