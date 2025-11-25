import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { http } from "../lib/http.js";
import Filterbar from "../components/Filterbar.jsx";
import SidebarCategories from "../components/SidebarCategories.jsx";
import SidebarFilter from "../components/SidebarFilter.jsx";
import SingleProduct from "./SingleProduct.jsx";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 4000]);

  // Lấy các tham số tìm kiếm từ URL
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || 1;
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 4000;

  // /products?category=1 = ? queryString - categoryId=1
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("limit", limit);
    p.set("page", page);
    if (category) p.set("categoryId", category);
    if (sort) p.set("sort", sort);
    if (min) p.set("minPrice", min);
    if (max) p.set("maxPrice", max);

    return p.toString();
  }, [category, sort, limit, page, min, max]);

  useEffect(() => {
    // Giả sử bạn có một API để lấy danh sách sản phẩm
    let canceled = false;
    setLoading(true);
    setError(null);

    async function loadProducts() {
      try {
        const res = await http.get(`/products?${queryString}`);
        const data = res.data.data;
        if (!canceled) {
          setProducts(data.products);
          setTotalPages(data.pagination.totalPages);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        if (!canceled) {
          setLoading(false);
          setError(
            error?.response?.data?.message ||
              error.message ||
              "unable to load products"
          );
        }
      }
    }

    loadProducts();

    return () => {
      canceled = true;
    };
  }, [queryString]);

  function handleSortChange(value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete("sort");
    else next.set("sort", value);
    next.set("page", 1);
    setSearchParams(next);
  }

  function handleLimitChange(value) {
    const next = new URLSearchParams(searchParams);
    next.set("page", 1);
    setSearchParams(next);
    setLimit(value);
  }

  function handlePageChange(value) {
    const next = new URLSearchParams(searchParams);
    if (!value) next.set("page", 1);
    else next.set("page", value);
    setSearchParams(next);
  }

  function handlePriceRangeChange(value) {
    setPriceRange(value);
    const next = new URLSearchParams(searchParams);
    if (value[0]) next.set("min", value[0]);
    else next.set("min", String(value[0]));
    if (value[1]) next.set("max", value[1]);
    else next.set("max", String(value[1]));

    next.set("page", 1);
    setSearchParams(next);
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-xl-3 col-lg-4 col-md-5">
          <SidebarCategories />
          <SidebarFilter
            priceRange={priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
        <div className="col-xl-9 col-lg-8 col-md-7">
          {loading && <div>Loading...</div>}
          {error && <div className="text-danger">Error: {error}</div>}
          {!loading && !error && (
            <>
              {/* Start Filter Bar */}
              <Filterbar
                sort={sort}
                onSortChange={handleSortChange}
                limit={limit}
                onLimitChange={handleLimitChange}
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              {/* End Filter Bar */}
              {/* Start Best Seller */}
              <section className="lattest-product-area pb-40 category-list">
                <div className="row">
                  {products.length === 0 ? (
                    <div className="alert alert-info">No products found.</div>
                  ) : (
                    <>
                      {products.map((product) => (
                        <SingleProduct key={product.id} product={product} />
                      ))}
                    </>
                  )}
                </div>
              </section>
              {/* End Best Seller */}
              {/* Start Filter Bar */}
              <Filterbar />
              {/* End Filter Bar */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
