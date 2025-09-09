
const Pagination = ({ onPageChange, currentPage, pageSize, blogs }) => {
    const totalPages = Math.ceil(blogs.length / pageSize);
    const renderPaginationLinks = () => {
        return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <li className={`${pageNumber === currentPage ? "bg-[#fc3c1a] rounded-[4px] text-white" : ""} mx-0 my-[5px]`} key={pageNumber}>
                <a className='inline-block px-[10px] py-[5px] border border-[#ccc] rounded-[4px] no-underline text-[#000] hover:bg-[#eee]' href="#" onClick={() => onPageChange(pageNumber)}>{pageNumber}</a>
            </li>
        ))
    }
    return (
        <ul className='my-8 flex-wrap gap-4 flex items-center justify-center m-0 p-0 list-none'>
            <li className='mx-[5px] my-0'>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
            </li>
            <div className='flex gap-1'>{renderPaginationLinks()}</div>
            <li>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
            </li>
        </ul>
    )
}

export default Pagination