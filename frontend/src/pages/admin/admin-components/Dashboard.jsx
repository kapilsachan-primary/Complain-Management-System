import React from "react";

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
  const statusCards = [
    { count: "10", head: "Resolved Jobs", icon: "fa-solid fa-check-double", link: "./admin/dashboard" },
    { count: "13", head: "Pending Jobs", icon: "fa-solid fa-clock-rotate-left", link: "./admin/dashboard" },
    { count: "12", head: "On Hold Jobs", icon: "fa-solid fa-pause", link: "./admin/dashboard" },
    { count: "26", head: "Not Assigned", icon: "fa-solid fa-hourglass", link: "./admin/dashboard" },
    { count: "12", head: "Total Technicians", icon: "fa-solid fa-screwdriver-wrench", link: "./admin/dashboard" },
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
