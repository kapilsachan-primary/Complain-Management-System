import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddProductorService,AddCategory } from "./AddEquipment";
const Equipments = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategories, setproductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [step, setStep] = useState(1); // Track step for Add Equipment popup
  const [errors,seterrors]=useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newProductorService, setNewProductorService] = useState({department: "",category: {_id: "",name: ""},type: "", modelNo: ""});

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/coordinator/status").then((res) => {
      if (res.data.Status !== "Success") {
        navigate("/coordinator-login");
      }
    });
  }, []);
  const fetchProducts = () =>{
    axios.get("http://localhost:3000/coordinator/allproducts").then((res) => {
      setData(res.data.products);
      setFilteredData(res.data.products);
      setproductCategories(res.data.productCategories);
      console.log("Product Categories",res.data.productCategories);
    }).catch((err)=> console.log(err));
  }
  const fetchCategories = () =>{
    axios.get("http://localhost:3000/coordinator/allcategories").then((res) => {
      setCategories(res.data);
    }).catch((err)=> console.log(err));
  }
  useEffect(() => {
    // fetch("/data/equipments-data.json")
    //   .then((response) => response.json())
    //   .then((jsonData) => {
    //     setData(jsonData);
    //     setFilteredData(jsonData);
    //     const uniqueCategories = ["All", ...new Set(jsonData.map((item) => item.category))];
    //    // setCategories(uniqueCategories);
    //   })
    //   .catch((error) => console.error("Error loading JSON data:", error));
    fetchProducts();
    fetchCategories();
  }, []);
  // useEffect(()=>{
    
  // },[])
  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
       // item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.categoryName.toLowerCase().includes(lowerCaseSearch)
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.categoryName === selectedCategory);
    }

    setFilteredData(filtered);
  }, [searchText, selectedCategory, data]);

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    // if (!equipmentToDelete) return;
    // const updatedData = data.filter((item) => item.id !== equipmentToDelete.id);
    // setData(updatedData);
    // setFilteredData(updatedData);
    // setShowDeletePopup(false);
    axios.delete('http://localhost:3000/coordinator/deleteproduct/'+equipmentToDelete._id)
        .then( res =>{
          if(res.data.Status === true){
          alert(res.data.Message);setShowDeletePopup(false);
          fetchCategories();fetchProducts();
        }
          else
          alert(res.data.Message);
        })
        .catch(err => console.log(err));
  };

  const handleNextStep = () => {setNewCategory('');setStep(2);};
  const handlePreviousStep = () => {setNewProductorService({ department: "", category:{_id:"",name:""},type: "", modelNo: "" });setStep(1);};

  const handleAddProductorService = (e) => {
      //alert("clicked");
      e.preventDefault();
      const checkerr = AddProductorService(newProductorService);
      seterrors(checkerr);
      console.log(checkerr)
      if (Object.entries(checkerr).length === 0) {
        if(newProductorService.type=="Services"){
        console.log("No Error in services");
        axios.post(`http://localhost:3000/coordinator/${newProductorService.category._id}/add-service`,{
          serviceName:newProductorService.modelNo,
      }).then(res => {
        if(res.data.Status === true){
          alert(res.data.message)
        }
        else{
          alert(res.data.message)
        }
      }).catch(err => console.log(err));
        }
        else if(newProductorService.type =="Product"){
          console.log("No error in Products")
        axios.post("http://localhost:3000/coordinator/addproduct",{
          name:newProductorService.modelNo,
          categoryName:newProductorService.category.name,
          categoryId:newProductorService.category._id,
          department:newProductorService.department
      }).then(res => {
        if(res.data.Status === true){
          alert(res.data.message);
          console.log("Product Added:", newProductorService);
          setShowAddPopup(false);
          setStep(1);
          // Reset values ONLY when the product is added
          setNewCategory('');
          setNewProductorService({ department: "", category: {_id:"",name:""},type: "", modelNo: "" });
          fetchProducts();
        }
        else{
          alert(res.data.message)
        }
      }).catch(err => console.log(err));
        }
       }
    else{
      setTimeout(() => seterrors({}), 3000)
    }
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setStep(1);

    // Reset values ONLY when the popup is closed
    setNewCategory('');
    setNewProductorService({ department: "", category: {_id:"",name:""},type: "", modelNo: "" });
  };

  const handleAddCategory = (e) => {
      e.preventDefault();
      const checkerr = AddCategory(newCategory);
      seterrors(checkerr);
      console.log(checkerr)
      if (Object.entries(checkerr).length === 0) {
        console.log("No error for category addition");
        axios.post("http://localhost:3000/coordinator/addcategory",{
          name:newCategory,
          hasServices:false
      }).then(res => {
        if(res.data.Status === true){
          alert(res.data.message)
          setShowAddPopup(false);
          setStep(1);

          // Reset values ONLY when the Category is added
          setNewCategory('');
          setNewProductorService({ department: "", category: {_id:"",name:""},type: "", modelNo: "" });
          fetchCategories();
        }
        else{
          alert(res.data.message)
        }
      }).catch(err => console.log(err));
      }
      else{
        setTimeout(() => seterrors({}), 3000)
      }
  };

  const columns = [
    // {
    //   name: <span className="column_header">Model No</span>,
    //   selector: (row) => row.modelNo,
    //   sortable: true,
    //   center: true
    // },
    {
      name: <span className="column_header">Product Name</span>,
      selector: (row) => row.name,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Department</span>,
      selector: (row) => row.department,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Category</span>,
      selector: (row) => row.categoryName,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Actions</span>,
      center: true,
      cell: (row) => (
        <button className="btn-view" onClick={() => handleDeleteClick(row)}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="flex flex-col gap-x-5 gap-y-10 sm:flex-row justify-between">
        <div className="select_container sm:!w-80 ">
          <select
            className="category-dropdown w-full !text-[14px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All" selected>All</option> 
            {productCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center self-end gap-12">
          <div id="add_technician_btn" className="whitespace-nowrap icon_btn_fill_primary" onClick={() => setShowAddPopup(true)}>
            <i className="fa-solid fa-plus"></i>
            <button>
              <span>Add Equipment</span>
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="datatable-container">
        <DataTable columns={columns} data={filteredData} pagination highlightOnHover striped responsive className="table-content" />
      </div>

      {showDeletePopup && (
        <div className="popup_container">
          <div className="popup_content delete_popup_content">
            <div className="popup_components">
              <h2>Are you sure?</h2>
              <p>Do you really want to delete <span>"{equipmentToDelete?.name}"</span>?</p>
              <section className="buttons_area_columns delete_user_popup_btns" >
                <section className="btn_fill_primary" onClick={() => setShowDeletePopup(false)}>
                  <button className="main_button">
                    <span>Cancel</span>
                  </button>
                </section>
                <section className="btn_outlined_primary_red" onClick={confirmDelete}>
                  <button className="main_button">
                    <span>Delete</span>
                  </button>
                </section>
              </section>
            </div>
          </div>
        </div>
      )}

      {showAddPopup && (
        <div className="popup_container">
          <div className="popup_content">

            <div className="x_icon" onClick={closeAddPopup}>
              <button className="close_popup">
                <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" />
              </button>
            </div>

            <form className="popup_components ">

              <div className="popup_tertiary_header_cont flex gap-8 flex-col sm:flex-row sm:items-center">
                <h1 className={`popup_tertiary_header ${step === 1 ? "font-bold" : "font-light"}`}>
                  Step 1: Add Category
                </h1>
                <i className="fa-solid fa-angle-right text-[2rem]"></i>
                <h1 className={`popup_tertiary_header ${step === 2 ? "font-bold" : "font-light"}`}>
                  Step 2: Add Product
                </h1>
              </div>


              {step === 1 && (
                <>
                  <div className="input_area_wrapper">
                    <section className="input_area_columns">

                      <section>
                        <div className="input_label">
                          <label htmlFor="all">Departments:</label>
                        </div>
                        <input
                          type="text"
                          id="all"
                          name="all"
                          placeholder="All"
                          className="custom-input"
                           value="All" // Controlled input
                          // onChange={(e) => setNewCategory({ ...newCategory, all: e.target.value })} // Keep state updated
                        />
                      </section>

                      <section>
                        <div className="input_label">
                          <label htmlFor="category">Category:</label>
                        </div>
                        <input
                          type="text"
                          id="category"
                          name="category"
                          placeholder="Category"
                          className="custom-input"
                          value={newCategory} // Controlled input
                          onChange={(e) => setNewCategory(e.target.value.toUpperCase())}// Keep state updated
                        />
                      </section>
                      {errors.newCategory && <div className="userform-error">{errors.newCategory}</div>}
                    </section>
                  </div>
                
                  <section className="buttons_area_columns popup_button">
                  <section className="btn_fill_primary" onClick={handleAddCategory}>
                      <button type="submit" className="main_button">
                        <span>Add</span>
                      </button>
                    </section>

                    <section className="btn_fill_primary" onClick={handleNextStep}>
                      <button type="submit" className="main_button">
                        <span>Next</span>
                      </button>
                    </section>
                  </section>

                </>
              )}


              {step === 2 && (
                <>
                  <div className="input_area_wrapper">
                    <section className="input_area_columns">

                      <section>
                        <div className="input_label">
                          <label htmlFor="department">Department:</label>
                        </div>
                        <div className="select_container">
                          <select
                            id="department"
                            name="department"
                            value={newProductorService.department} // Controlled select
                            onChange={(e) => setNewProductorService({ ...newProductorService, department: e.target.value })} // Keep state updated
                          >
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
                      </section>
                      {errors.department && <div className="userform-error">{errors.department}</div>}
                      <section>
                        <div className="input_label">
                          <label htmlFor="department">Category:</label>
                        </div>
                        <div className="select_container">
                          <select
                            id="category"
                            name="category"
                            value={newProductorService.category?._id || ""}
                            onChange={(e) => {const selectcateg=categories.find(cat => cat._id === e.target.value)
                              setNewProductorService({ ...newProductorService,
                              category: selectcateg?{_id:selectcateg._id,name:selectcateg.name}:null })}} // Keep state updated
                          >
                            <option value="" disabled>Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id} 
                              value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </section>
                      {errors.category && <div className="userform-error">{errors.category}</div>}
                      <section>
                        <div className="input_label">
                          <label htmlFor="department">Type:</label>
                        </div>
                        <div className="select_container">
                          <select
                            id="type"
                            name="type"
                            value={newProductorService.type} // Controlled select
                            onChange={(e) => setNewProductorService({ ...newProductorService, type: e.target.value })} // Keep state updated
                          >
                            <option value="" disabled hidden>Select Type:</option>
                            <option value="Services">Services</option>
                            <option value="Product">Product</option>
                          </select>
                        </div>
                      </section>
                      {errors.type && <div className="userform-error">{errors.type}</div>}
                      <section>
                        <div className="input_label">
                          <label htmlFor="modelNo">Service Name/Model No.</label>
                        </div>
                        <input
                          type="text"
                          id="modelNo"
                          name="modelNo"
                          placeholder="Service Name/Model No."
                          className="custom-input"
                          value={newProductorService.modelNo} // Controlled input
                          onChange={(e) => setNewProductorService({ ...newProductorService, modelNo: e.target.value })} // Keep state updated
                        />
                      </section>
                      {errors.modelNo && <div className="userform-error">{errors.modelNo}</div>}
                    </section>
                  </div>

                  <section className="buttons_area_columns">
                    <section className="btn_outlined_primary">
                      <button className="main_button" onClick={handlePreviousStep}>
                        <span>Back</span>
                      </button>
                    </section>

                    <section className="btn_fill_primary">
                      <button className="main_button" onClick={handleAddProductorService}>
                        <span>Add</span>
                      </button>
                    </section>

                  </section>

                </>
              )}

            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default Equipments;
