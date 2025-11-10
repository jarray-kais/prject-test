const Pagination = ({ pagination, isPageChanging, handlePageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;

  const renderPageNumbers = () => {
    const items = [];
    const candidates = [currentPage - 1, currentPage, currentPage + 1];

    candidates.forEach((p) => {
      if (p >= 1 && p <= totalPages) {
        items.push(
          <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(p)} disabled={isPageChanging}>
              {p}
            </button>
          </li>
        );
      }
    });

    return items;
  };

  return (
    <nav className="d-flex justify-content-center mt-4" aria-label="Pagination">
      <ul className="pagination">
        <li className={`page-item ${!hasPrevPage || isPageChanging ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage || isPageChanging}
          >
            Précédent
          </button>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${!hasNextPage || isPageChanging ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || isPageChanging}
          >
            Suivant
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;