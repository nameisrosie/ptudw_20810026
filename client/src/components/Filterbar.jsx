const SORTS = [
  { value: "", label: "Default sorting" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name ASC" },
  { value: "name_desc", label: "Name DESC" },
];

export default function Filterbar({
  sort = "",
  onSortChange,
  limit = 9,
  onLimitChange,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const numTotalPages = Number(totalPages) || 1;
  const numPage = Number(page) || 1;

  const prevDisabled = numPage <= 1;
  const prevNumPage = prevDisabled ? 1 : numPage - 1;
  const nextDisabled = numPage >= numTotalPages;
  const nextNumPage = nextDisabled ? numTotalPages : numPage + 1;

  const start = Math.max(1, numPage - 2);
  const end = Math.min(numTotalPages, numPage + 4);
  const pages = [];
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="filter-bar d-flex flex-wrap align-items-center">
      <div className="sorting">
        <select
          className="nice-select"
          onChange={(e) => onSortChange(e.target.value)}
          value={sort}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sorting mr-auto">
        <select
          className="nice-select"
          value={limit}
          onChange={(e) => onLimitChange(e.target.value)}
        >
          {[6, 9, 12].map((l) => (
            <option key={l} value={l}>
              Show {l}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination">
        <a className="prev-arrow" onClick={() => onPageChange(prevNumPage)}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" />
        </a>
        {start > 1 && (
          <a href="#" className="dot-dot">
            <i className="fa fa-ellipsis-h" aria-hidden="true" />
          </a>
        )}

        {pages.map((p) => (
          <a
            key={p}
            onClick={() => onPageChange(p)}
            className={`${p === numPage ? "active" : ""}`}
          >
            {p}
          </a>
        ))}

        {end < numTotalPages && (
          <a href="#" className="dot-dot">
            <i className="fa fa-ellipsis-h" aria-hidden="true" />
          </a>
        )}

        <a
          href="#"
          className="next-arrow"
          onClick={() => onPageChange(nextNumPage)}
        >
          <i className="fa fa-long-arrow-right" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
