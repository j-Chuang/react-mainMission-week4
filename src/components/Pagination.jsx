function Pagination ({pageInfo, handlePageChange}) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
              <a onClick={(e)=>{handlePageChange(e, pageInfo.current_page - 1)}} className="page-link" href="#">
                上一頁
              </a>
            </li>

            {Array.from({length: pageInfo.total_pages}).map((_,index) =>{
              return (<li key={index} className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`}>
                <a onClick={(e)=>{handlePageChange(e, index + 1)}} className="page-link" href="#">
                  {index + 1}
                </a>
              </li>)
            })}
            
            <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
              <a onClick={(e)=>{handlePageChange(e, pageInfo.current_page + 1)}} className="page-link" href="#">
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Pagination;