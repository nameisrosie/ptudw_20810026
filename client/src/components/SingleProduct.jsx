export default function SingleProduct({ product }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="single-product">
        <img className="img-fluid" src={product.imagePath} />
        <div className="product-details">
          <h6>{product.name}</h6>
          <div className="price">
            <h6>{product.price}</h6>
            {/* <h6 className="l-through">$210.00</h6> */}
          </div>
          <div className="prd-bottom">
            <a className="social-info">
              <span className="ti-bag" />
              <p className="hover-text">add to bag</p>
            </a>
            <a className="social-info">
              <span className="lnr lnr-heart" />
              <p className="hover-text">Wishlist</p>
            </a>
            <a className="social-info">
              <span className="lnr lnr-sync" />
              <p className="hover-text">compare</p>
            </a>
            <a className="social-info" href={`/products/${product.id}`}>
              <span className="lnr lnr-move" />
              <p className="hover-text">view more</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
