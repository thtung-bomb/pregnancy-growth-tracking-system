import { Link } from "react-router-dom";
import NewsViewALotCard from "../../molecules/news-view-a-lot-card/NewsViewALotCard"
import { newsData } from "../news-container/NewsContainer"

interface NewsViewALotProps {
    selectedCategory: string | null;
}

const NewsViewALot = ({selectedCategory}: NewsViewALotProps) => {

    const filteredNews = selectedCategory
        ? newsData.filter(item => item.category === selectedCategory)
        : newsData;

    const newsDataFilter = [...filteredNews]
    .sort((a, b) => b.view_counts - a.view_counts) // Sắp xếp giảm dần theo view_counts
    .slice(0, 3); // Lấy 3 bài báo có view_counts cao nhất 3); // Lấy 3 bài báo có view_count cao nhất


    return (
        <div className="border border-solid p-5 mt-5 rounded-xl">
        <div className='text-gray-400 text-xl font-semibold'>
            Tin xem nhiều
        </div>
        <div className="">
            {
                newsDataFilter.map((item) => (
                    <div className="mt-10">
                        <Link to={"/news/detail"}>
                        <NewsViewALotCard
                            time={item.time}
                            title={item.title}
                            image={item.image}
                        />
                        </Link>
                    </div>
                ))
            }
        </div>
    </div>
    )
}

export default NewsViewALot
