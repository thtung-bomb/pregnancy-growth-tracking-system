import NewsCategory from "../../atoms/news-category/NewsCategory";

interface NewsProps {
  title: string;
  descripion: string;
  image: string;
  time: string;
  category: string;
}
const News = ({ title, descripion, time, category, image }: NewsProps) => {
  return (
    <div className='mt-5 border border-solid p-2 rounded-xl hover:border-yellow-400 grid grid-cols-12 gap-4 w-[900px] hover:bg-yellow-50'>
      <div className="col-span-4"> 
        <img className="rounded-xl" src={image} alt={title} />
      </div>
      <div className="col-span-8">
        <div className="text-xl font-semibold">
          {title}
        </div>
        <div className="mt-2">
          {descripion}
        </div>
        <div className="flex gap-4 items-center text-gray-400 mt-3">
          <div className="text-xs">
            {time}
          </div>
          <div>
            |
          </div>
          <div>
            <NewsCategory category_name={category} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
