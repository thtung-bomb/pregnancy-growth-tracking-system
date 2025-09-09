interface TitleProps{
    text: string,
    className?: string;
}

const Title = ({text, className}: TitleProps) => {
  return (
    <div className={`${className} font-semibold text-pink-600 text-5xl`}>
        {text}
    </div>
  )
}

export default Title