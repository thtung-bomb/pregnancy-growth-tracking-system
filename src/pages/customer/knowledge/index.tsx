import { useState } from "react";
import KnowledgeContainer from "../../../components/organisms/knowledge-container/KnowledgeContainer";
import KnowledgeMenu from "../../../components/molecules/knowledge-menu/KnowledgeMenu";
import KnowledgeViewALot from "../../../components/organisms/knowledge-view-a-lot/KnowledgeViewALot";

const Knowledge = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="mx-5">
            <div className="container mx-auto justify-items-center">
                <div className="grid grid-cols-12 w-[1260px]">
                    <div className="col-span-9 justify-items-center">
                        <KnowledgeContainer selectedCategory={selectedCategory} />
                    </div>
                    <div className="col-span-3 mt-10">
                        <KnowledgeMenu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                        <KnowledgeViewALot selectedCategory={selectedCategory}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Knowledge
