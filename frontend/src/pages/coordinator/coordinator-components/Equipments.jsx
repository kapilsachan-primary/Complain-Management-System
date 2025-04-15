import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddProductorService, AddCategory, HandleExcelValidate } from "./AddEquipment";
import * as XLSX from "xlsx";
const Equipments = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategories, setproductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [select_container, setSelectContainer] = useState("All");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteCatPopup, setShowDeleteCatPopup] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState({ name: "", category: "" });
  const [showDeleteServPopup, setShowDeleteServPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeleteInvPopup, setDeleteInvPopup] = useState(false);
  const [step, setStep] = useState(1); // Track step for Add Equipment popup
  const [errors, seterrors] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newProductorService, setNewProductorService] = useState({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" });
  const [categoryLoading, setCategotyLoading] = useState(false);
  const [serprodLoading, setServprodLoading] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelErrors, setExcelErrors] = useState({});
  const [excelData, setExcelData] = useState([]);
  const [excelFormatChecker, setExcelFormatChecker] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/status`).then((res) => {
      if (res.data.Status !== "Success") {
        navigate("/coordinator-login");
      }
    });
  }, []);
  const fetchProducts = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/allproducts`).then((res) => {
      setData(res.data.products);
      setFilteredData(res.data.products);
      setproductCategories(res.data.productCategories);
      //console.log("Product Categories", res.data.productCategories);
    }).catch((err) => console.log(err));
  }
  const fetchCategories = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/allcategories`).then((res) => {
      setCategories(res.data);
    }).catch((err) => console.log(err));
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
  useEffect(() => {
    setNewProductorService((prev) => ({
      ...prev,
      department: "",
    }));
  }, [newProductorService.type])

  useEffect(() => {
    setSelectedFile(null);
    setExcelFormatChecker(false);
  }, [select_container])

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
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/coordinator/deleteproduct/` + equipmentToDelete._id)
      .then(res => {
        if (res.data.Status === true) {
          alert(res.data.Message); setShowDeletePopup(false);
          fetchCategories(); fetchProducts();
        }
        else
          alert(res.data.Message);
      })
      .catch(err => console.log(err));
  };

  // Delete a category
  const categoryDelete = (categoryId) => {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/coordinator/deleteCategory/${categoryId}`)
      .then(res => {
        if (res.status === 200) {
          alert(res.data.message);
          setDeleteInvPopup(false);
          fetchCategories();
          fetchProducts();
          setSelectContainer("All");
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.log(err));
  };

  // Delete a service
  const serviceDelete = (categoryId, serviceName) => {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/coordinator/${categoryId}/remove-service`, {
      data: { serviceName }
    })
      .then(res => {
        if (res.status === 200) {
          alert(res.data.message);
          setShowDeleteServPopup(false);
          setDeleteInvPopup(false);
          fetchCategories();
          fetchProducts();
          setSelectContainer("All");
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.log(err));
  };


  const handleNextStep = () => { setNewCategory(''); setStep(2); };
  const handlePreviousStep = () => { setNewProductorService({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" }); setStep(1); };

  const handleAddProductorService = (e) => {
    //alert("clicked");
    e.preventDefault();
    const checkerr = AddProductorService(newProductorService);
    seterrors(checkerr);
    //console.log(checkerr)
    if (Object.entries(checkerr).length === 0) {
      if (newProductorService.type == "Services") {
        //console.log("No Error in services");
        setServprodLoading(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/coordinator/${newProductorService.category._id}/add-service`, {
          serviceName: newProductorService.modelNo,
        }).then(res => {
          if (res.data.Status === true) {
            alert(res.data.message)
            setShowAddPopup(false);
            setStep(1); fetchCategories();
            // Reset values ONLY when the product is added
            setNewCategory('');
            setNewProductorService({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" });
          }
          else {
            alert(res.data.message)
          }
        }).catch(err => console.log(err)
        ).finally(() => {
          setServprodLoading(false);
        })
      }
      else if (newProductorService.type == "Product") {
        //console.log("No error in Products")
        setServprodLoading(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/coordinator/addproduct`, {
          name: newProductorService.modelNo,
          categoryName: newProductorService.category.name,
          categoryId: newProductorService.category._id,
          department: newProductorService.department
        }).then(res => {
          if (res.data.Status === true) {
            alert(res.data.message);
            //console.log("Product Added:", newProductorService);
            setShowAddPopup(false);
            setStep(1);
            // Reset values ONLY when the product is added
            setNewCategory('');
            setNewProductorService({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" });
            fetchProducts();
          }
          else {
            alert(res.data.message)
          }
        }).catch(err => console.log(err)
        ).finally(() => {
          setServprodLoading(false);
        })
      }
    }
    else {
      setTimeout(() => seterrors({}), 3000)
    }
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setStep(1);

    // Reset values ONLY when the popup is closed
    setNewCategory('');
    setNewProductorService({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const checkerr = AddCategory(newCategory);
    seterrors(checkerr);
    //console.log(checkerr)
    if (Object.entries(checkerr).length === 0) {
      //console.log("No error for category addition");
      setCategotyLoading(true);
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/coordinator/addcategory`, {
        name: newCategory,
        hasServices: false
      }).then(res => {
        if (res.data.Status === true) {
          alert(res.data.message)
          // setShowAddPopup(false);
          setTimeout(() => setStep(2), 500);

          // Reset values ONLY when the Category is added
          setNewCategory('');
          setNewProductorService({ department: "", category: { _id: "", name: "" }, type: "", modelNo: "" });
          fetchCategories();
        }
        else {
          alert(res.data.message)
        }
      }).catch(err => console.log(err)
      ).finally(() => { setCategotyLoading(false) });
    }
    else {
      setTimeout(() => seterrors({}), 3000)
    }
  };
  const EXPECTED_HEADERS = {
    department: "Departments",
    name: "Make - Model No - Dead Stock Number",
  };
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setSelectedFile(file);
    const checkerr = HandleExcelValidate(file);
    setExcelErrors(checkerr);
    // your upload logic here...
    if (Object.entries(checkerr).length > 0) {
      //console.log("Excel errors",checkerr);
      setSelectedFile(null);
      //setTimeout(() => setExcelErrors({}), 3000)
      return;
    }
    setExcelErrors({});
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = rows[0];
      const dataRows = rows.slice(1);
      // Get exact indexes
      const deptIndex = headers.findIndex(h => h.trim().toLowerCase() === EXPECTED_HEADERS.department.toLowerCase());
      const nameIndex = headers.findIndex(h => h.trim().toLowerCase() === EXPECTED_HEADERS.name.toLowerCase());

      if (deptIndex === -1 || nameIndex === -1) {
        alert(`Excel format is incorrect. Expected columns: ${EXPECTED_HEADERS.department} and ${EXPECTED_HEADERS.name}`);
        setExcelFormatChecker(false); setSelectedFile(null);
        return;
      }
      setExcelFormatChecker(true);
      const parsedData = dataRows.map(row => ({
        department: row[deptIndex],
        name: row[nameIndex]
      }));
      setExcelData(parsedData);
    }
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (!select_container || excelData.length === 0) return;
    const formattedData = excelData.map((row) => ({
      name: row.name,
      categoryName: categories.find(cat => cat._id === select_container)?.name,
      category: select_container,
      department: row.department,
    }));
    setUploadLoading(true);
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/coordinator/bulkproducts`, {
      products: formattedData,
    }
    ).then(res => {
      alert(res.data.message);
    }).catch(err => console.log(err)
    ).finally(() => {
      setUploadLoading(false);
      setSelectedFile(null); setExcelData([]);
      setSelectContainer("All"); // ✅ Reset dropdown
      setShowUploadPopup(false); // Optional: close popup after upload
      fetchProducts();
      setExcelFormatChecker(false);
    })
  };

  const handleDownloadTemplate = () => {
    window.alert('Download Template button clicked!');
    // Your existing logic to handle the download goes here
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


  const filteredPopupData = select_container === "All"
    ? categories.flatMap((category) => category.services || [])
    : categories.find((item) => item._id === select_container)?.services || [];

  return (
    <section>
      <div className="flex flex-col gap-x-5 gap-y-10 md:flex-row justify-between">
        <div className="select_container w-full md:!w-80 ">
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

        <div className="flex items-center flex-col md:flex-row self-end gap-6 w-full md:!w-auto">

          <div id="add_technician_btn" className="whitespace-nowrap icon_btn_fill_primary_danger w-full md:!w-auto" onClick={() => setDeleteInvPopup(true)}>
            <i className="fa-solid fa-minus"></i>
            <button>
              <span>Delete Inventory</span>
            </button>
          </div>

          <div id="upload_file_btn" className="whitespace-nowrap icon_btn_fill_primary w-full md:!w-auto" onClick={() => setShowUploadPopup(true)}>
            <i class="fa-solid fa-layer-group"></i>
            <button>
              <span>Upload Excel</span>
            </button>
          </div>

          <div id="add_technician_btn" className="whitespace-nowrap icon_btn_fill_primary w-full md:!w-auto" onClick={() => setShowAddPopup(true)}>
            <i className="fa-solid fa-plus"></i>
            <button>
              <span>Add Equipment</span>
            </button>
          </div>

          <div className="search-container !w-full md:!w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="search-input !w-full md:!w-auto"
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
                  Add Category
                </h1>
                <i class="fa-solid fa-grip-lines-vertical text-[2rem]"></i>
                <h1 className={`popup_tertiary_header ${step === 2 ? "font-bold" : "font-light"}`}>
                  Add Product
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
                        {errors.newCategory && <div className="popupform-error">{errors.newCategory}</div>}
                      </section>
                    </section>
                  </div>

                  <section className="buttons_area_columns popup_button">
                    <section className="btn_outlined_primary" onClick={handleNextStep} disabled={categoryLoading}>
                      <button type="submit" className="main_button">
                        <span>{categoryLoading ? "Adding" : "Next"}</span>
                      </button>
                    </section>
                    <section className="btn_fill_primary" onClick={handleAddCategory} disabled={categoryLoading}>
                      <button type="submit" className="main_button">
                        <span>{categoryLoading ? "Adding" : "Add"}</span>
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
                          <label htmlFor="type">Type:</label>
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
                          {errors.type && <div className="popupform-error">{errors.type}</div>}
                        </div>
                      </section>

                      {/* Conditional rendering based on the Type selection */}
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
                            {newProductorService.type === "Services" ? (
                              <option value="all">All</option>
                            ) : (
                              <>
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
                              </>
                            )}
                          </select>
                          {errors.department && <div className="popupform-error">{errors.department}</div>}
                        </div>
                      </section>

                      <section>
                        <div className="input_label">
                          <label htmlFor="department">Category:</label>
                        </div>
                        <div className="select_container">
                          <select
                            id="category"
                            name="category"
                            value={newProductorService.category?._id || ""}
                            onChange={(e) => {
                              const selectcateg = categories.find(cat => cat._id === e.target.value)
                              setNewProductorService({
                                ...newProductorService,
                                category: selectcateg ? { _id: selectcateg._id, name: selectcateg.name } : null
                              })
                            }} // Keep state updated
                          >
                            <option value="" disabled>Select Category</option>
                            {categories.map((category) => (
                              <option key={category._id}
                                value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {errors.category && <div className="popupform-error">{errors.category}</div>}
                        </div>
                      </section>

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
                        {errors.modelNo && <div className="popupform-error">{errors.modelNo}</div>}
                      </section>

                    </section>
                  </div>

                  <section className="buttons_area_columns">
                    <section className="btn_outlined_primary">
                      <button className="main_button" onClick={handlePreviousStep} disabled={serprodLoading}>
                        <span>{serprodLoading ? "Adding" : "Back"}</span>
                      </button>
                    </section>

                    <section className="btn_fill_primary">
                      <button className="main_button" onClick={handleAddProductorService} disabled={serprodLoading}>
                        <span>{serprodLoading ? "Adding" : "Add"}</span>
                      </button>
                    </section>

                  </section>

                </>
              )}

            </form>

          </div>
        </div>
      )}




      {showDeleteInvPopup && (
        <div className="popup_container fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="popup_content bg-white rounded-xl shadow-lg w-[90%] max-w-4xl p-6 relative flex flex-col gap-6">

            {/* Close Button */}
            <div className="x_icon" onClick={() => { setDeleteInvPopup(false); setSelectContainer("All"); }}>
              <button className="close_popup">
                <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" />
              </button>
            </div>

            <form className="popup_components flex flex-col gap-6">
              <h2 className="text-4xl font-semibold text-gray-800">Delete Inventory</h2>

              <div className="flex flex-col sm:flex-row gap-12">
                {/* Left Container */}
                <div className="flex-1 h-fit">
                  <div className="select_container ">
                    <select
                      className="category-dropdown w-full !text-[14px]"
                      value={select_container}
                      onChange={(e) => setSelectContainer(e.target.value)}
                    >
                      <option value="All">All</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="!mt-2">
                    <p className="text-2xl text-gray-500">Select a category to remove services from the inventory.</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-gray-300" />

                {/* Right Container */}
                <div className="w-full sm:w-1/2 flex flex-col gap-4">
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-gray-800">
                        {select_container === "All"
                          ? "All Categories"
                          : categories.find((item) => item._id === select_container)?.name}
                      </span>

                      {/* Only show delete button if a specific category is selected */}
                      {select_container !== "All" && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-lg"
                          onClick={() => {
                            const selectedCat = categories.find(cat => cat._id === select_container);
                            if (selectedCat) {
                              setCategoryToDelete(selectedCat);
                              setShowDeleteCatPopup(true);
                            }
                          }}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-500 text-xl mt-1">Services under this category:</p>
                  </div>

                  {/* Services */}
                  <div id="equipments_delete_popup" className="flex flex-col gap-3 max-h-[32rem] overflow-y-auto">
                    {filteredPopupData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2.5 px-5 border border-gray-500 rounded-lg bg-gray-200/50"
                      >
                        <h4 className="text-3xl font-medium !py-2.5 !px-5 text-gray-700">{item}</h4>

                        {/* Only show delete button if a specific category is selected */}
                        {select_container !== "All" && (
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 text-2xl bg-transparent border-none focus:outline-none"
                            onClick={() => {
                              const selectedCategory = categories.find(cat => cat._id === select_container)?.name || "All";
                              setEquipmentToDelete({ name: item, category: selectedCategory });
                              setShowDeleteServPopup(true);
                            }}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteCatPopup && (
        <div className="popup_container">
          <div className="popup_content delete_popup_content">
            <div className="popup_components">
              <h2>Are you sure?</h2>
              <p className="text-xl text-gray-600 mb-6">
                Do you really want to delete <span>"{categoryToDelete?.name}"</span> category?
              </p>
              <section className="buttons_area_columns delete_user_popup_btns">
                <section className="btn_fill_primary" onClick={() => setShowDeleteCatPopup(false)}>
                  <button className="main_button">
                    <span>Cancel</span>
                  </button>
                </section>
                <section
                  className="btn_outlined_primary_red"
                  onClick={() => {
                    categoryDelete(categoryToDelete._id);
                    setShowDeleteCatPopup(false);
                  }}
                >
                  <button className="main_button">
                    <span>Delete</span>
                  </button>
                </section>
              </section>
            </div>
          </div>
        </div>
      )}


      {showDeleteServPopup && (
        <div className="popup_container">
          <div className="popup_content delete_popup_content">
            <div className="popup_components">
              <h2>Are you sure?</h2>
              <p className="text-xl text-gray-600 mb-6">
                Do you really want to delete{" "}
                <span>"{equipmentToDelete?.name}"</span>
                {equipmentToDelete?.category && (
                  <> from <span>"{equipmentToDelete?.category}"</span> category</>
                )}
                ?
              </p>
              <section className="buttons_area_columns delete_user_popup_btns">
                <section className="btn_fill_primary" onClick={() => setShowDeleteServPopup(false)}>
                  <button className="main_button">
                    <span>Cancel</span>
                  </button>
                </section>
                <section
                  className="btn_outlined_primary_red"
                  onClick={() => {
                    serviceDelete(select_container, equipmentToDelete.name);
                  }}
                >
                  <button className="main_button">
                    <span>Delete</span>
                  </button>
                </section>
              </section>
            </div>
          </div>
        </div>
      )}

      {showUploadPopup && (
        <div className="popup_container fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="popup_content bg-white rounded-xl shadow-lg w-[90%] max-w-4xl p-6 relative flex flex-col gap-6">

            {/* Close Button */}
            <div
              className="x_icon"
              onClick={() => {
                setShowUploadPopup(false);
                setSelectedFile(null);        // ✅ Reset file input on close
                setSelectContainer("All");    // ✅ Reset dropdown to "All"
                setExcelFormatChecker(false); setExcelData([]);
              }}
            >
              <button className="close_popup">
                <img src="/assets/icons/x-icon.svg" alt="Close Popup" />
              </button>
            </div>

            <form className="popup_components flex flex-col gap-6">
              <h2 className="text-4xl font-semibold text-gray-800">Upload File</h2>

              <div className="flex flex-col sm:flex-row gap-12">
                {/* Left Container */}
                <div className="flex-1 h-fit">
                  <div className="flex justify-center items-center gap-12">
                    {/* Dropdown */}
                    <div className="select_container">
                      <select
                        className="category-dropdown w-full !text-[14px]"
                        value={select_container}
                        onChange={(e) => setSelectContainer(e.target.value)}
                      >
                        <option value="All">All</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Download Template Button */}
                    <button
                      id="upload_file_btn"
                      className="whitespace-nowrap icon_btn_fill_primary w-full sm:!w-auto flex items-center gap-2"
                      onClick={handleDownloadTemplate}
                    >
                      <i className="fa-regular fa-file-lines"></i>
                      <span>Download Template</span>
                    </button>
                  </div>

                  <div className="!mt-2">
                    <p className="text-2xl text-gray-500">Select a category to upload file.</p>
                  </div>

                  {/* Show input + button only when NOT All */}
                  {select_container !== "All" && (
                    <div className="!mt-10 flex flex-col">
                      <div className="flex gap-6 w-full border border-gray-300 rounded-lg overflow-hidden">
                        <input
                          type="text"
                          readOnly
                          placeholder="Please select your file"
                          value={selectedFile ? selectedFile.name : ''}
                          className="flex-1 px-4 py-3 text-gray-700 focus:outline-none "
                        />
                        <label
                          className="text-white flex justify-center items-center w-30 px-5 py-3 cursor-pointer hover:bg-blue-700 transition text-sm font-medium !rounded-lg"
                          style={{ backgroundColor: "var(--color-deepskyblue)" }}
                        >
                          <span className="text-5xl text-center">
                            <i className="fa-solid fa-plus"></i>
                          </span>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {excelErrors.selectedFile && <div className="popupform-error">{excelErrors.selectedFile}</div>}
                      {/* Upload Button */}
                      {excelFormatChecker && (
                        <section className="buttons_area_columns popup_button">
                          <section className="btn_outlined_primary" onClick={handleFileUpload} disabled={uploadLoading}>
                            <button type="submit" className="main_button">
                              <span>{uploadLoading ? "Uploading..." : "Upload"}</span>
                            </button>
                          </section>
                        </section>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}









    </section>
  );
};

export default Equipments;
