import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const StatusCard = ({ count, head, icon, link }) => {
  return (
    <section className="stats_card_wrapper">
      <section className="stats_card">
        <section className="card__details">
          <p className="card__count">{count}</p>
          <p className="card__head">{head}</p>
        </section>
        <a href="#" className="card__more_info">
          <div className="info_right_icon">
            <i className="fa-solid fa-angle-right"></i>
          </div>
          <a href={link}>More Info</a>
        </a>
        <div className="stats_card_icon">
          <i className={icon}></i>
        </div>
      </section>
    </section>
  );
};


const Dashboard = () => {
  axios.defaults.withCredentials = true;
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const [values,setvalues]=useState({pendingjobs: 0,resolvedjobs: 0,onholdjobs: 0});
    useEffect(() => {
        axios.get("http://localhost:3000/technician/status").then((res) => {
            if (res.data.Status === "Success") {
                setName(res.data.name);
                setId(res.data.id);
            } else {
                navigate("/technician-login");
            }
        });
    }, []);
    useEffect(()=>{
      axios.get(`http://localhost:3000/technician/countjobs/${name}`)
      .then(res =>{
        setvalues(res.data)
        console.log(res.data)
      }).catch(err =>{console.log(err)})
    },[name])
  const statusCards = [
    { count: values.resolvedjobs, head: "Resolved Jobs", icon: "fa-solid fa-check-double", link: "./admin/dashboard" },
    { count: values.pendingjobs, head: "Pending Jobs", icon: "fa-solid fa-clock-rotate-left", link: "./admin/dashboard" },
    { count: values.onholdjobs, head: "On Hold Jobs", icon: "fa-solid fa-pause", link: "./admin/dashboard" },
  ];

  return (
    <section className="page_content_section dashboard_content">
      <section className="dashboard_overview">
        <section className="head_container">
          <h2>Dashboard</h2>
          <p>Overview</p>
        </section>
        <section className="overview_cards">
          {statusCards.map((card, index) => (
            <StatusCard
              key={index}
              count={card.count}
              head={card.head}
              icon={card.icon}
              link={card.link}
            />
          ))}
        </section>
      </section>
    </section>
  );
};

export default Dashboard;
