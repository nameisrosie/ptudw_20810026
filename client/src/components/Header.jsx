import { useState } from "react";
import Banner from "../components/Banner.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn load lại trang
    console.log("Dữ liệu form:", formData);
    alert("Cảm ơn bạn đã liên hệ! (Chức năng này cần Backend xử lý gửi mail)");
  };

  return (
    <>
      <Banner title="Contact Us" to="/contact" />
      <section className="contact_area section_gap_bottom">
        <div className="container">
          {/* Map Box Placeholder */}
          <div
            id="mapBox"
            className="mapBox"
            style={{ 
              height: "300px", 
              background: "#f0f0f0", 
              marginBottom: "50px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderRadius: "5px"
            }}
          >
             <p className="text-muted">Google Map Area (Requires API Key)</p>
          </div>
          
          <div className="row">
            <div className="col-lg-3">
              <div className="contact_info">
                <div className="info_item">
                  <i className="lnr lnr-home" />
                  <h6>California, United States</h6>
                  <p>Santa monica bullevard</p>
                </div>
                <div className="info_item">
                  <i className="lnr lnr-phone-handset" />
                  <h6><a href="#">00 (440) 9865 562</a></h6>
                  <p>Mon to Fri 9am to 6 pm</p>
                </div>
                <div className="info_item">
                  <i className="lnr lnr-envelope" />
                  <h6><a href="#">support@colorlib.com</a></h6>
                  <p>Send us your query anytime!</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-9">
              <form 
                className="row contact_form" 
                onSubmit={handleSubmit}
                id="contactForm"
              >
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      placeholder="Enter Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      name="message"
                      id="message"
                      rows={1}
                      placeholder="Enter Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 text-right">
                  <button type="submit" className="primary-btn">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}