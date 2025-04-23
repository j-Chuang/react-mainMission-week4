import PropTypes from "prop-types";

function Pagination2({ pageInfo, handlePageChange }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
              <button
                onClick={() => handlePageChange(pageInfo.current_page - 1)}
                className="page-link"
              >
                上一頁
              </button>
            </li>
            {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
              return (
                <li
                  key={index + 1}
                  className={`page-item ${
                    pageInfo.current_page === index + 1 && "active"
                  }`}
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
              <button
                onClick={() => handlePageChange(pageInfo.current_page + 1)}
                className="page-link"
              >
                下一頁
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Pagination2;

Pagination2.propTypes = {
  pageInfo: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};
