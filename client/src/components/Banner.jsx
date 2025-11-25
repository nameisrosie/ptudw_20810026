export default function Banner({ title = "Karma Shop", to }) {
  return (
    <section className="banner-area organic-breadcrumb">
      <div className="container">
        <div className="breadcrumb-banner d-flex flex-wrap align-items-center justify-content-end">
          <div className="col-first">
            <h1>{title}</h1>
            <nav className="d-flex align-items-center">
              <a href="/">
                Home
                {to && <span className="lnr lnr-arrow-right" />}
              </a>
              {to && <a href={to}>{title}</a>}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
