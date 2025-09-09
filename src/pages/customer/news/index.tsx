import { useState } from "react";
import NewsContainer from "../../../components/organisms/news-container/NewsContainer";
import NewsMenu from "../../../components/molecules/news-menu/NewsMenu";
import NewsViewALot from "../../../components/organisms/news-view-a-lot/NewsViewALot";

const News = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="mx-5">
            <div className="container mx-auto justify-items-center">
                <div className="grid grid-cols-12 w-[1260px]">
                    <div className="col-span-9 justify-items-center">
                        <NewsContainer selectedCategory={selectedCategory} />
                    </div>
                    <div className="col-span-3 mt-10">
                        <NewsMenu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        <NewsViewALot selectedCategory={selectedCategory}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
