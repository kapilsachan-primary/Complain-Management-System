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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState(null);
  const [loading,setLoading] = useState(false); 
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    password: "",
    confirmpass: "",
  });
  const [errors, seterrors] = useState({});
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const fetchtechnicians=()=>{
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/details`, {
      fetch: 'technician',
    })
      .then(res => {
        setData(res.data);
        //console.log(res.data);
        setFilteredData(res.data);
      })
      .catch(err => { console.log(res.data.message) });
  }
  useEffect(() => {
    fetchtechnicians();
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/status`).then((res) => {
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

  const handleAddTechnician = async (e) => {
    e.preventDefault();
    //console.log("Adding Technician:", formData);

    const checkerr = RegisterValidate(formData);
    seterrors(checkerr);

    if (Object.entries(checkerr).length === 0) {
      setLoading(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/technician/register`, {
          name: formData.name,
          email: formData.email,
          contactno: formData.contactNo,
          password: formData.password,
        });

        if (res.data.status) {
          // alert(res.data.message);
          setShowPopup(false);

          // Update state to show new technician in the table immediately
          // const newTechnician = {
          //   name: formData.name,
          //   email: formData.email,
          //   contactno: formData.contactNo,
          // };
          // setData((prevData) => [...prevData, newTechnician]);
          // setFilteredData((prevData) => [...prevData, newTechnician]);

          // Reset form data
          setFormData({
            name: "",
            contactNo: "",
            email: "",
            password: "",
            confirmpass: "",
          });
          fetchtechnicians();
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.log(err);
      } finally{
        setLoading(false);
      }
    } else {
      setTimeout(() => seterrors({}), 3000);
    }
  };


  const handleDeleteClick = (technician) => {
    setTechnicianToDelete(technician);
    setShowDeletePopup(true);
  };

  function confirmDelete() {
    if (!technicianToDelete) return;

    axios.put(`${import.meta.env.VITE_BACKEND_URL}/technician/clearstatus`,{id:technicianToDelete._id,})
    .then(res => {
    if(res.data.Status === true){
      axios.delete(`${import.meta.env.VITE_BACKEND_URL}/technician/deletetechnician/`+technicianToDelete._id)
        .then( res =>{
          if(res.data.Status === true){
          alert(res.data.Message);setShowDeletePopup(false);
          fetchtechnicians();
        }
          else
          alert(res.data.Message);
        })
        .catch(err => console.log(err));
    }
    else{
      alert(res.data.message)
    }
  }).catch(err => console.log(err));
  };

  const columns = [
    {
      name: <span className="column_header">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Contact No</span>,
      selector: (row) => row.contactno,
      sortable: true,
      center: true
    },
    {
      name: <span className="column_header">Email</span>,
      selector: (row) => row.email,
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
    <>
      <div className="controls">
        <div className="w-full flex justify-between items-center gap-12">
          <div id="add_technician_btn" className="icon_btn_fill_primary" onClick={() => setShowPopup(true)}>
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
                <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" />
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
              <section className="buttons_area_columns popup_button">
                <section className="btn_fill_primary">
                  <button type="submit" className="main_button" onClick={handleAddTechnician} disabled={loading}>
                    <span>{loading?"Adding":"Add"}</span>
                  </button>
                </section>
              </section>
            </form>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="popup_container ">
          <div className="popup_content delete_popup_content">
            <div className="popup_components">
              <h2>Are you sure?</h2>
              <p>Do you really want to delete <span> "{technicianToDelete?.name}" </span>?</p>
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

    </>
  );
};

export default Technician;