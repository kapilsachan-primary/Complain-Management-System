import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Equipments = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [step, setStep] = useState(1); // Track step for Add Equipment popup

  const [newCategory, setNewCategory] = useState({ all: "", category: "" });
  const [newProduct, setNewProduct] = useState({ department: "", category: "", modelNo: "" });

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/coordinator/status").then((res) => {
      if (res.data.Status !== "Success") {
        navigate("/coordinator-login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    fetch("/data/equipments-data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setFilteredData(jsonData);
        const uniqueCategories = ["All", ...new Set(jsonData.map((item) => item.category))];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error loading JSON data:", error));
  }, []);

  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.modelNo.toLowerCase().includes(lowerCaseSearch) ||
        item.productName.toLowerCase().includes(lowerCaseSearch) ||
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.category.toLowerCase().includes(lowerCaseSearch)
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredData(filtered);
  }, [searchText, selectedCategory, data]);

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (!equipmentToDelete) return;
    const updatedData = data.filter((item) => item.id !== equipmentToDelete.id);
    setData(updatedData);
    setFilteredData(updatedData);
    setShowDeletePopup(false);
  };

  const handleNextStep = () => setStep(2);
  const handlePreviousStep = () => setStep(1);

  const handleAddProduct = () => {
    console.log("Product Added:", newProduct);
    setShowAddPopup(false);
    setStep(1);

    // Reset values ONLY when the product is added
    setNewCategory({ all: "", category: "" });
    setNewProduct({ department: "", category: "", modelNo: "" });
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setStep(1);

    // Reset values ONLY when the popup is closed
    setNewCategory({ all: "", category: "" });
    setNewProduct({ department: "", category: "", modelNo: "" });
  };



  const columns = [
    {
      name: <span className="column_header">Model No</span>,
      selector: (row) => row.modelNo,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Product Name</span>,
      selector: (row) => row.productName,
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
      selector: (row) => row.category,
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
            {categories.map((category, index) => (
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
              <p>Do you really want to delete <span>"{equipmentToDelete?.productName}"</span>?</p>
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
                          <label htmlFor="all">All:</label>
                        </div>
                        <input
                          type="text"
                          id="all"
                          name="all"
                          placeholder="All"
                          className="custom-input"
                          value={newCategory.all} // Controlled input
                          onChange={(e) => setNewCategory({ ...newCategory, all: e.target.value })} // Keep state updated
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
                          value={newCategory.category} // Controlled input
                          onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })} // Keep state updated
                        />
                      </section>

                    </section>
                  </div>

                  <section onClick={handleNextStep} className="buttons_area_columns popup_button">
                    <section className="btn_fill_primary">
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
                            value={newProduct.department} // Controlled select
                            onChange={(e) => setNewProduct({ ...newProduct, department: e.target.value })} // Keep state updated
                          >
                            <option value="" disabled hidden>Select department</option>
                            <option value="Applied Mechanics">Applied Mechanics</option>
                            <option value="Artificial Intelligence and Machine Learning">AI & ML</option>
                            <option value="Automobile Engineering">Automobile Engineering</option>
                          </select>

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
                            value={newProduct.category} // Controlled select
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} // Keep state updated
                          >
                            <option value="" disabled hidden>Select Category</option>
                            <option value="Tools">Tools</option>
                            <option value="Repair">Repair</option>
                          </select>
                        </div>
                      </section>

                      <section>
                        <div className="input_label">
                          <label htmlFor="modelNo">Model No:</label>
                        </div>
                        <input
                          type="text"
                          id="modelNo"
                          name="modelNo"
                          placeholder="Model No"
                          className="custom-input"
                          value={newProduct.modelNo} // Controlled input
                          onChange={(e) => setNewProduct({ ...newProduct, modelNo: e.target.value })} // Keep state updated
                        />
                      </section>

                    </section>
                  </div>

                  <section className="buttons_area_columns">
                    <section className="btn_outlined_primary">
                      <button className="main_button" onClick={handlePreviousStep}>
                        <span>Back</span>
                      </button>
                    </section>

                    <section className="btn_fill_primary">
                      <button className="main_button" onClick={handleAddProduct}>
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
