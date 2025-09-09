
export interface NewsDetailCardProps {
    description: string;
    image: string
}
const NewsDetailCard = ({ description, image }: NewsDetailCardProps) => {
    return (
        <div>
            <div>
                {description}
            </div>
            <div className="my-2">
              <img src={image} alt="" />
            </div>
        </div>
    )
}

export default NewsDetailCard
