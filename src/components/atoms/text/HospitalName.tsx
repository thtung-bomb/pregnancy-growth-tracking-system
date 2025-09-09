import React from 'react'

interface HospitalNameProps{
    className?: string
}

const HospitalName = ({className}: HospitalNameProps) => {
  return (
    <div className={`${className} font-bold text-red-700 text-3xl`}>
        NestCare
    </div>
  )
}

export default HospitalName