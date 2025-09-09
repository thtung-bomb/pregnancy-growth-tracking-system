import { ReactNode, useState } from "react";

interface ExpandableCardContainerProps {
  cards: ReactNode;
  component_name: string;
}

const ExpandableCardContainer = ({ cards, component_name }: ExpandableCardContainerProps) => {
  const [showAll, setShowAll] = useState(false);

  // Xác định chiều cao theo component_name
  const heightMap: Record<string, string> = {
    SpecialtyDetailList: "1750px",
  };

  const height = heightMap[component_name] || "500px"; // Giá trị mặc định nếu không có trong map

  return (
    <div className="flex flex-col items-center">
      <div
        className={`transition-all duration-300 ${showAll ? "max-h-none" : "overflow-hidden"}`}
        style={{ maxHeight: showAll ? "none" : height }}
      >
        {cards}
      </div>
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition bg-gray-300"
      >
        {showAll ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
};

export default ExpandableCardContainer;
