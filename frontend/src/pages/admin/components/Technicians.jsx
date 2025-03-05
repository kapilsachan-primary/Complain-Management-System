import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterValidate from "../../auth/RegistrationValidation";
const Technician = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    password: "",
    confirmpass: "",
  });
  const [errors,seterrors]=useState({});
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("/data/technician-data.json");
    //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //     const result = await response.json();
    //     setData(result);
    //     setFilteredData(result);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchData();
    axios.post('http://localhost:3000/admin/details',{
      fetch:'technician',
      })
      .then(res => {
      setData(res.data);
      console.log(res.data);
      setFilteredData(res.data);
      })
      .catch(err => {console.log(res.data.message)});
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/admin/status").then((res) => {
      if (res.data.Status !== "Success") {
        navigate("/admin-login");
      }
    });
  }, []);

  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        (item.contactno).toString().includes(lowerCaseSearch) ||
        item.email.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTechnician = (e) => {
    e.preventDefault();
    console.log("Adding Technician:", formData);
      const checkerr = RegisterValidate(formData);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);
      if (Object.entries(checkerr).length === 0) {
        axios.post("http://localhost:3000/technician/register",{
          name:formData.name,
          email:formData.email,
          contactno:formData.contactNo,
          password:formData.password,
        }).then(res =>{
             // console.log(res);
              if(res.data.status){
              alert(res.data.message);
              setShowPopup(false);
              }
              else
              alert(res.data.message);
        }).catch(err =>{
          console.log(err);
        })
      }
      else {
        setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
      }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Contact No", selector: (row) => row.contactno, sortable: true, center: true },
    { name: "Email", selector: (row) => row.email, sortable: true, center: true },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <button className="btn-view" onClick={() => alert(`Delete Technician: ${row.name}`)}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="controls">
        <div className="w-full flex justify-between items-center gap-12">
          <div id="add_technician_btn" className="add_btn" onClick={() => setShowPopup(true)}>
            <i className="fa-solid fa-plus"></i>
            <button>
              <span>Add Technician</span>
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

      {showPopup && (
        <div className="popup_container">
          <div className="popup_content">
            <div className="x_icon" onClick={() => setShowPopup(false)}>
              <button className="close_popup">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form className="popup_components ">
              <h1 className="popup_primary_header">Add Technician</h1>
              <input type="text" placeholder="Name" className="poup-input" name="name" onChange={handleInputChange} />
              {errors.name && <div className='authform-error'>{errors.name}</div>}
              <input type="email" placeholder="Email" className="poup-input" name="email" onChange={handleInputChange} />
              {errors.email && <div className='authform-error'>{errors.email}</div>}
              <input type="tel" placeholder="Phone Number" className="poup-input" name="contactNo" onChange={handleInputChange} />
              {errors.contactNo && <div className='authform-error'>{errors.contactNo}</div>}
              <input type="password" placeholder="Password" className="poup-input" name="password" onChange={handleInputChange} />
              {errors.password && <div className='authform-error'>{errors.password}</div>}
              <input type="password" placeholder="Confirm Password" className="poup-input" name="confirmpass" onChange={handleInputChange} />
              {errors.confirmpass && <div className='authform-error'>{errors.confirmpass}</div>}
              <section class="buttons_area_columns popup_button">
                <section class="btn_fill_primary">
                  <button type="submit" class="main_button" onClick={handleAddTechnician}>
                    <span>Add</span>
                  </button>
                </section>
              </section>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Technician;