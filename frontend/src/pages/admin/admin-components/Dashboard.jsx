import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
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
  const [values,setvalues]=useState({najobs: 0,pendingjobs: 0,resolvedjobs: 0,onholdjobs: 0,technicians: 0});
  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get('http://localhost:3000/admin/countjobs')
    .then(res =>{
      setvalues(res.data)
      console.log(res.data)
    }).catch(err =>{console.log(err)})
  },[])
  const statusCards = [
    { count: values.resolvedjobs, head: "Resolved Jobs", icon: "fa-solid fa-check-double", link: "./admin/dashboard" },
    { count: values.pendingjobs, head: "Pending Jobs", icon: "fa-solid fa-clock-rotate-left", link: "./admin/dashboard" },
    { count: values.onholdjobs, head: "On Hold Jobs", icon: "fa-solid fa-pause", link: "./admin/dashboard" },
    { count: values.najobs, head: "Not Assigned", icon: "fa-solid fa-hourglass", link: "./admin/dashboard" },
    { count: values.technicians, head: "Total Technicians", icon: "fa-solid fa-screwdriver-wrench", link: "./admin/dashboard" },
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
