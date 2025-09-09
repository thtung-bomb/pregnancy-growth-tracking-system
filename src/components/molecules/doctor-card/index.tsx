import React from "react";
import { User } from "../../../model/User";

interface DoctorCardProps {
	doctor: User,
	background_color: string
}

const DoctorCardDisplay: React.FC<DoctorCardProps> = ({ doctor, background_color }: DoctorCardProps) => {
	return (
		<div style={{ width: "350px" }} className={`border border-solid p-5 ${background_color === "pink" ? "bg-pink-100" : "bg-sky-300"}  text-lg rounded-lg`}>
			<p className='font-bold'>{doctor.fullName}</p>
			<p>Bác sĩ</p>
			<img
				src={doctor.image !== "string" ? doctor.image : "https://sihospital.com.vn/uploads/202405/18/Rq6jtz-ba--ng.png"}
				alt={doctor.fullName}
				className="w-full h-80 object-cover rounded-lg mt-3"
			/>
		</div>
	);
};

export default DoctorCardDisplay;
