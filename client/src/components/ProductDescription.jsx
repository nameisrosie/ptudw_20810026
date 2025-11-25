import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { http } from "../lib/http.js";
import StarRating from "./StarRating.jsx";
import ImageGallery from "./ImageGallery.jsx";

export default function ProductDescription({}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    let canceled = false;

    setLoading(true);
    setError(null);

    async function loadProduct() {
      try {
        const res = await http.get(`/products/${id}`);

        if (!canceled) {
          setProduct(res.data.data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (!canceled) {
          setLoading(false);
          setError(
            err?.response?.data?.message ||
              err.message ||
              "unable to load product"
          );
        }
      }
    }

    loadProduct();

    return () => {
      canceled = true;
    };
  }, [id]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">Error: {error}</div>}
      {!loading && !error && (
        <div>
          <div className="product_image_area">
            <div className="container">
              <div className="row s_product_inner">
                <div className="col-lg-6">
                  <div className="s_Product_carousel">
                    <ImageGallery images={product.Images} />
                  </div>
                </div>
                <div className="col-lg-5 offset-lg-1">
                  <div className="s_product_text">
                    <h3>{product.name}</h3>
                    <h2>${product.price}</h2>
                    <ul className="list">
                      <li>
                        <a className="active" href="#">
                          <span>Category</span> : {product.Category.name}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>Availibility</span> : In Stock
                        </a>
                      </li>
                    </ul>
                    <p>{product.summary}</p>
                    <div className="product_count">
                      <label htmlFor="qty">Quantity:</label>
                      <input
                        type="text"
                        name="qty"
                        id="sst"
                        maxLength={12}
                        defaultValue={1}
                        title="Quantity:"
                        className="input-text qty"
                      />
                      <button
                        onclick="var result = document.getElementById('sst'); var sst = result.value; if( !isNaN( sst )) result.value++;return false;"
                        className="increase items-count"
                        type="button"
                      >
                        <i className="lnr lnr-chevron-up" />
                      </button>
                      <button
                        onclick="var result = document.getElementById('sst'); var sst = result.value; if( !isNaN( sst ) && sst > 0 ) result.value--;return false;"
                        className="reduced items-count"
                        type="button"
                      >
                        <i className="lnr lnr-chevron-down" />
                      </button>
                    </div>
                    <div className="card_area d-flex align-items-center">
                      <a className="primary-btn" href="#">
                        Add to Cart
                      </a>
                      <a className="icon_btn" href="#">
                        <i className="lnr lnr lnr-diamond" />
                      </a>
                      <a className="icon_btn" href="#">
                        <i className="lnr lnr lnr-heart" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*================End Single Product Area =================*/}
          {/*================Product Description Area =================*/}
          <section className="product_description_area">
            <div className="container">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Description
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="review-tab"
                    data-toggle="tab"
                    href="#review"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                  >
                    Reviews
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  {product.description}
                </div>
                <div
                  className="tab-pane fade show active"
                  id="review"
                  role="tabpanel"
                  aria-labelledby="review-tab"
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row total_rate">
                        <div className="col-6">
                          <div className="box_total">
                            <h5>Overall</h5>
                            <h4>{product.stars}</h4>
                            <h6>({product.reviewsCount} Reviews)</h6>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="rating_list">
                            <h3>Based on {product.reviewsCount} Reviews</h3>
                            <ul className="list">
                              <li>
                                <a href="#">
                                  5 Star <StarRating rating={5} />{" "}
                                  {
                                    product.Reviews.filter(
                                      (r) => r.rating === 5
                                    ).length
                                  }
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  4 Star <StarRating rating={4} />{" "}
                                  {
                                    product.Reviews.filter(
                                      (r) => r.rating === 4
                                    ).length
                                  }
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  3 Star <StarRating rating={3} />{" "}
                                  {
                                    product.Reviews.filter(
                                      (r) => r.rating === 3
                                    ).length
                                  }
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  2 Star <StarRating rating={2} />{" "}
                                  {
                                    product.Reviews.filter(
                                      (r) => r.rating === 2
                                    ).length
                                  }
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  1 Star <StarRating rating={1} />{" "}
                                  {
                                    product.Reviews.filter(
                                      (r) => r.rating === 1
                                    ).length
                                  }
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="review_list">
                        {product.Reviews.map((r) => (
                          <div className="review_item">
                            <div className="media">
                              <div className="d-flex">
                                <img
                                  src={r.User.profileImage}
                                  style={{ width: "70px", height: "70px" }}
                                  className="rounded rounded-circle"
                                />
                              </div>
                              <div className="media-body">
                                <h4>
                                  {r.User.firstName} {r.User.lastName}
                                </h4>
                                <StarRating rating={r.rating} />
                              </div>
                            </div>
                            <p>{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="review_box">
                        <h4>Add a Review</h4>
                        <p>Your Rating:</p>
                        <ul className="list">
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                        </ul>
                        <p>Outstanding</p>
                        <form
                          className="row contact_form"
                          action="contact_process.php"
                          method="post"
                          id="contactForm"
                          noValidate="novalidate"
                        >
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Your Full name"
                                onfocus="this.placeholder = ''"
                                onblur="this.placeholder = 'Your Full name'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                onfocus="this.placeholder = ''"
                                onblur="this.placeholder = 'Email Address'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="number"
                                name="number"
                                placeholder="Phone Number"
                                onfocus="this.placeholder = ''"
                                onblur="this.placeholder = 'Phone Number'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="message"
                                id="message"
                                rows={1}
                                placeholder="Review"
                                onfocus="this.placeholder = ''"
                                onblur="this.placeholder = 'Review'"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-md-12 text-right">
                            <button
                              type="submit"
                              value="submit"
                              className="primary-btn"
                            >
                              Submit Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
