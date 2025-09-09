import React from "react";

interface DoctorCardProps {
  name: string;
  specialty: string;
  professional_qualifications: string;
  background_color: string;
  image: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialty, image, professional_qualifications, background_color }) => {
  return (
    <div style={{ width: "350px" }} className={`border border-solid p-5 ${background_color === "pink" ? "bg-pink-100" : "bg-sky-300"}  text-lg rounded-lg`}>
      <p className='font-bold'>{professional_qualifications} {name}</p>
      <p>{specialty}</p>
      <img src={image} alt={name} />
    </div>
  );
};

export default DoctorCard;
