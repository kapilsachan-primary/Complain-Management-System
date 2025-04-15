import { useState, useEffect } from "react";
import UserformValidate from "./UserformValidation";
import axios from "axios";
export default function UserDashboard() {
  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    name: "",
    roomNo: "",
    contactNo: "",
    email: "",
    category: "",
    department: "",
    productdescription: "",
    services: "",
    descriptionRemarks: "",
  });
  const [errors, seterrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  // Fetch categories on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Fetch products when department or category changes
  useEffect(() => {
    if (selectedDepartment && selectedCategory) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/products`, {
        params: { department: selectedDepartment, categoryname: selectedCategory }
      })
        .then(response => {
          setProducts(response.data.products)
        })
        .catch(error => console.error("Error fetching products:", error));
    } else {
      setProducts([]); // Reset products if no selection
    }
  }, [selectedDepartment, selectedCategory]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productdescription: "",
    }));
  }, [formData.category, formData.department])

  // // services & productdescription options based on category
  // const options = {
  //   printer: {
  //     servicess: ["Printer refilling", "Printer repair"],
  //     productdescriptions: ["LaserJet Printer", "OfficeJet Printer"]
  //   },
  //   cctv: {
  //     servicess: ["Camera not working", "CCTV wiring issue"],
  //     productdescriptions: ["Dome Camera", "Bullet Camera"]
  //   }
  // };

  // ----- OLD CODE - (Kapil) -----
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // ----- NEW CODE - (Naitik) -----
  // Modify handleChange function to reset services & productdescription when category changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      //...(name === "category" ? { services: "", productdescription: "" } : {}) // Reset services & productdescription if category changes
    }));
    if (name === "category") {
      setSelectedCategory(value);
      const category = categories.find(cat => cat.name === value);
      if (category?.hasServices) {
        setIsServiceEnabled(true);
        setServices(category.services);
      } else {
        setIsServiceEnabled(false);
        setServices([]);
        setFormData((prev) => ({
          ...prev,
          services: "",
        }));
      }
    }
    else if (name === "department") {
      setSelectedDepartment(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Form Submitted", formData);
    const checkerr = UserformValidate(formData, isServiceEnabled, products);
    seterrors(checkerr);
    //console.log(Object.entries(checkerr).length);
    if (Object.entries(checkerr).length === 0) {
      //console.log("Good to goo");
      setLoading(true);
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/complain`, {
        name: formData.name,
        roomno: formData.roomNo,
        contactno: formData.contactNo,
        email: formData.email,
        category: formData.category,
        department: formData.department,
        productdescription: formData.productdescription,
        services: formData.services,
        descriptionRemarks: formData.descriptionRemarks,
      }).then(res => {
        //console.log(res);
        if (res.status == 200 || res.status == 422) {
          alert(res.data.message);
          window.location.reload();
        }
        else if (res.status == 500) {
          alert(res.data.message);
          //window.location.reload();
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      })
    } else {
      setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
    }
  };


  return (
    <main id="user_dashboard" className="main_content">

      {/* Header */}
      <header id="user_dashboard_header" className="flex justify-between">
        {/* Sidebar Navigation Logo */}
        <a href="./dashboard.html" className="sidebar_nav_logo">
          <img src="/assets/logos/ldce-logo.png" alt="LDEC-LOGO" />
          <span>L.D. College Of<br /> Engineering</span>
        </a>

        <section className="page_content_header text-end">
          <h1>User Dashboard</h1>
          <p>Raise Issues with Ease – Get Quick Resolutions Fast!</p>
        </section>

      </header>

      {/* User Form */}
      <section className="form_section flex justify-center items-center flex-grow w-full px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-[80vw]">

          <form className="issue_form w-full">

            <div className="input_area_wrapper !max-w-full">
              <section className="input_area_columns">

                <section className="input_area_two_columns">

                  <section>
                    <div className="input_label">
                      <label htmlFor="name">Name:</label>
                    </div>
                    <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                    {errors.name && <div className='userform-error'>{errors.name}</div>}
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="roomNo">Room No:</label>
                    </div>
                    <input type="text" id="roomNo" name="roomNo" placeholder="Enter your room number" value={formData.roomNo} onChange={handleChange} />
                    {errors.roomNo && <div className='userform-error'>{errors.roomNo}</div>}
                  </section>
                </section>


                <section className="input_area_two_columns">
                  <section>
                    <div className="input_label">
                      <label htmlFor="contactNo">Contact No:</label>
                    </div>
                    <input type="number" id="contactNo" name="contactNo" placeholder="Enter your contact number" value={formData.contactNo} onChange={handleChange} />
                    {errors.contactNo && <div className='userform-error'>{errors.contactNo}</div>}
                  </section>
                  <section>
                    <div className="input_label">
                      <label htmlFor="email">Email:</label>
                    </div>
                    <input type="email" id="email" name="email" placeholder="Enter your contact number" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className='userform-error'>{errors.email}</div>}
                  </section>

                </section>

                <section>
                  <div className="input_label">
                    <label htmlFor="department">Department:</label>
                  </div>
                  <div className="select_container">
                    <select id="department" name="department" value={formData.department} onChange={handleChange}>
                      <option value="" disabled hidden>Select department</option>
                      <option value="applied-mechanics">Applied Mechanics</option>
                      <option value="artificial-intelligence">Artificial Intelligence and Machine Learning</option>
                      <option value="automobile-engineering">Automobile Engineering</option>
                      <option value="biomedical-engineering">Biomedical Engineering</option>
                      <option value="chemical-engineering">Chemical Engineering</option>
                      <option value="civil-engineering">Civil Engineering</option>
                      <option value="computer-engineering">Computer Engineering</option>
                      <option value="electrical-engineering">Electrical Engineering</option>
                      <option value="electronics-communication">Electronics and Communication Engineering</option>
                      <option value="environment-engineering">Environment Engineering</option>
                      <option value="information-technology">Information Technology</option>
                      <option value="instrumentation-control">Instrumentation & Control Engineering</option>
                      <option value="mechanical-engineering">Mechanical Engineering</option>
                      <option value="plastic-technology">Plastic Technology</option>
                      <option value="robotics-automation">Robotics and Automation</option>
                      <option value="rubber-technology">Rubber Technology</option>
                      <option value="science-humanities">Science and Humanities</option>
                      <option value="textile-technology">Textile Technology</option>
                    </select>

                  </div>
                  {errors.department && <div className='userform-error'>{errors.department}</div>}
                </section>

                <section>
                  <div className="input_label">
                    <label htmlFor="category">Category:</label>
                  </div>
                  <div className="select_container">
                    <select id="category" name="category" value={formData.category} onChange={handleChange}>
                      <option value="" disabled hidden selected>Select Category</option>
                      {/* <option value="printer">Printer</option>
                    <option value="cctv">CCTV</option> */}
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category && <div className='userform-error'>{errors.category}</div>}
                </section>
                {isServiceEnabled && (
                  <section>
                    <div className="input_label">
                      <label htmlFor="services">Services:</label>
                    </div>
                    <div className="select_container">
                      <select
                        id="services"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                      // disabled={!formData.category}
                      // style={{ cursor: formData.category ? "default" : "not-allowed" }}
                      >
                        <option value="" disabled hidden>Select Services</option>
                        {/* {formData.category && options[formData.category].servicess.map((desc, index) => (
                      <option key={index} value={desc}>{desc}</option>
                    ))} */}
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>

                    </div>
                    {errors.services && <div className='userform-error'>{errors.services}</div>}
                  </section>
                )}
                <section>
                  <div className="input_label">
                    <label htmlFor="productdescription">Product Description:</label>
                  </div>
                  <div className="select_container">
                    <select
                      id="productdescription"
                      name="productdescription"
                      value={formData.productdescription}
                      onChange={handleChange}
                      disabled={products.length === 0}
                      style={{ cursor: products.length !== 0 ? "default" : "not-allowed" }}
                    >
                      <option value="" disabled hidden>Select Product</option>
                      {/* {formData.category && options[formData.category].productdescriptions.map((mdl, index) => (
                      <option key={index} value={mdl}>{mdl}</option>
                    ))} */}
                      {products.map((prod) => (
                        <option key={prod._id} value={prod.name}>{prod.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.productdescription && <div className='userform-error'>{errors.productdescription}</div>}
                </section>

                <section>
                  <div className="input_label">
                    <label htmlFor="descriptionRemarks">Description/Remarks:</label>
                  </div>
                  <textarea
                    name="descriptionRemarks"
                    id="descriptionRemarks"
                    className="custom-textarea"
                    placeholder="Remarks"
                    value={formData.descriptionRemarks} onChange={handleChange}
                  ></textarea>
                  {errors.descriptionRemarks && <div className='userform-error'>{errors.descriptionRemarks}</div>}
                </section>

                {/* OLD - Prioriy Select Input */}
                {/* <section>
                <div className="input_label">
                  <label htmlFor="priority">Priority:</label>
                </div>
                <div className="select_container">
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="" disabled hidden selected>Select Issue Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                {errors.priority && <div className='userform-error'>{errors.priority}</div>}
              </section> */}

                {/* NEW - Prioriy Select Input */}
                {/* <section>
                <div className="input_label">
                  <label htmlFor="priority">Priority:</label>
                </div>
                <div className="select_container">
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange} disabled className="cursor-not-allowed">
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low" >Low</option>
                  </select>
                </div>
                {errors.priority && <div className='userform-error'>{errors.priority}</div>}
              </section> */}

              </section>
            </div>

            <section className="buttons_area_columns flex justify-end">
              <section className="btn_fill_primary">
                <button type="submit" className="main_button" onClick={handleSubmit} disabled={loading}>
                  <span>{loading ? "Submiting" : "Raise Complaint"}</span>
                </button>
              </section>
            </section>

          </form>

        </div>
      </section>

    </main>
  );
}
