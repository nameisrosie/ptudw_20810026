import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <--- 1. Import Link
import { http } from "../lib/http.js";

export default function SidebarCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await http.get("/categories");
        const data = res.data.data;
        // console.log(res.data);
        if (!canceled) {
          setCategories(data);
          setLoading(false);
        }
      } catch (error) {
        if (!canceled) {
          setError(
            error?.response?.data?.message || error.message || "Unknown error"
          );
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="sidebar-categories">
      <div className="head">Browse Categories</div>
      <ul className="main-categories">
        {loading && <div>Loading...</div>}
        {error && <div className="text-danger">Error: {error}</div>}
        {!loading &&
          !error &&
          categories.map((c) => (
            <li className="main-nav-list" key={c.id}>
              {/* 2. Sửa thẻ a thành Link để không bị reload trang */}
              <Link to={"/products?category=" + c.id}>
                {c.name}
                <span className="number">({c.Products?.length || 0})</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}