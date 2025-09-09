interface NewsViewALotCard {
    title: string;
    image: string;
    time: string;
}

const NewsViewALotCard = ({ image, time, title }: NewsViewALotCard) => {
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
                <img src={image} alt={title} />
            </div>
            <div className="col-span-8  font-semibold  ">
                <div className="line-clamp-2 text-lg">
                    {title}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    {time}
                </div>
            </div>

        </div>
    )
}

export default NewsViewALotCard
