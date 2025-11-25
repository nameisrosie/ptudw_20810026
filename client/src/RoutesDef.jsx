import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

export default function RoutesDef() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="contact" element={<Contact />} />
    </Routes>
  );
}
