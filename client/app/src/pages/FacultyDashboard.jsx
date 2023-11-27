import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import network from "../config/network";
import { userContext } from "../App";
import { Link } from "react-router-dom";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    borderColor: "#000",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000, // Ensure it's above other elements
    boxShadow: "0 0 10px rgba(0, 0, 0, 1)", // Shadow effect
  },
};

function FacultyDashboard() {
  const { token } = useContext(userContext);
  const { user } = useContext(userContext);
  const [notices, setNotices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    document.title = "Admin Dashboard | College ERP";
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(
          `${network.server}/api/admin/getfilterednotice?faculty=${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotices(response.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    fetchNotices();
  }, [token]);

  const handleViewNotice = (notice) => {
    setSelectedNotice(notice);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedNotice(null);
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="page-sub-header">
                <h3 className="page-title">Welcome Admin!</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Admin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Overview Section */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-comman w-100">
              <div className="card-body">
                <div className="db-widgets d-flex justify-content-between align-items-center">
                  <div className="db-info">
                    <h6>Students</h6>
                    <h3>50055</h3>
                  </div>
                  <div className="db-icon">
                    <img
                      src="assets/img/icons/dash-icon-01.svg"
                      alt="Dashboard Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-comman w-100">
              <div className="card-body">
                <div className="db-widgets d-flex justify-content-between align-items-center">
                  <div className="db-info">
                    <h6>Awards</h6>
                    <h3>50+</h3>
                  </div>
                  <div className="db-icon">
                    <img
                      src="assets/img/icons/dash-icon-02.svg"
                      alt="Dashboard Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-comman w-100">
              <div className="card-body">
                <div className="db-widgets d-flex justify-content-between align-items-center">
                  <div className="db-info">
                    <h6>Department</h6>
                    <h3>30+</h3>
                  </div>
                  <div className="db-icon">
                    <img
                      src="assets/img/icons/dash-icon-03.svg"
                      alt="Dashboard Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-comman w-100">
              <div className="card-body">
                <div className="db-widgets d-flex justify-content-between align-items-center">
                  <div className="db-info">
                    <h6>Revenue</h6>
                    <h3>$505</h3>
                  </div>
                  <div className="db-icon">
                    <img
                      src="assets/img/icons/dash-icon-04.svg"
                      alt="Dashboard Icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Overview Section */}
        <div className="row">
          <div className="col-md-12 col-lg-6">
            {/* Revenue Chart */}
            <div className="card card-chart">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h5 className="card-title">Overview</h5>
                  </div>
                  <div className="col-6">
                    <ul className="chart-list-out">
                      <li>
                        <span className="circle-blue" />
                        Teacher
                      </li>
                      <li>
                        <span className="circle-green" />
                        Student
                      </li>
                      <li className="star-menus">
                        <a href="javascript:;">
                          <i className="fas fa-ellipsis-v" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div id="apexcharts-area" />
              </div>
            </div>
            {/* /Revenue Chart */}
          </div>
          <div className="col-md-12 col-lg-6">
            {/* Student Chart */}
            <div className="card card-chart">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h5 className="card-title">Number of Students</h5>
                  </div>
                  <div className="col-6">
                    <ul className="chart-list-out">
                      <li>
                        <span className="circle-blue" />
                        Girls
                      </li>
                      <li>
                        <span className="circle-green" />
                        Boys
                      </li>
                      <li className="star-menus">
                        <a href="javascript:;">
                          <i className="fas fa-ellipsis-v" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div id="bar" />
              </div>
            </div>
            {/* /Student Chart */}
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 d-flex">
            {/* Notice */}
            <div className="card flex-fill student-space comman-shadow">
              <div className="card-header d-flex align-items-center">
                <h5 className="card-title">Notice Board</h5>
                <ul className="chart-list-out student-ellips">
                  <li className="star-menus">
                    <a href="javascript:;">
                      <i className="fas fa-ellipsis-v" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="notice-board">
                  <div className="table-responsive">
                    <table className="table table-striped custom-table">
                      <thead>
                        <tr>
                          <th>Notice</th>
                          <th>Notice Date</th>
                          <th>Notice For</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notices && notices.map((notice) => (
                          <tr key={notice._id}>
                            <td>
                              <h5 className="mb-0 text-primary">
                                {notice.title}
                              </h5>
                            </td>
                            <td>{notice.date}</td>
                            <td>{notice.to}</td>
                            <td className="text-center">
                              <button
                                onClick={() => handleViewNotice(notice)}
                                className="btn btn-sm btn-primary"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Modal */}
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={handleCloseModal}
                    contentLabel="Notice Modal"
                    style={customStyles}
                  >
                    {selectedNotice && (
                      <div className="card">
                        <div className="page-header">
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="page-sub-header">
                                <h3 className="page-title" style={{textTransform:"capitalize"}}>
                                  {selectedNotice.title}
                                </h3>
                                <ul className="breadcrumb">
                                  <li className="breadcrumb-item">
                                    <Link to="/dashboard">{selectedNotice.date}</Link>
                                  </li>
                                  <li className="breadcrumb-item active">
                                    Notice
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                          <div className="row" >
                            <p>{selectedNotice.content}</p>
                          </div>
                  
                      </div>
                    )}
                  </Modal>
                  {/* Modal end */}
                </div>
              </div>
            </div>
            {/* Notice */}
          </div>
        </div>
        {/* Socail Media Follows */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card flex-fill fb sm-box">
              <div className="social-likes">
                <p>Like us on facebook</p>
                <h6>50,095</h6>
              </div>
              <div className="social-boxs">
                <img
                  src="assets/img/icons/social-icon-01.svg"
                  alt="Social Icon"
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card flex-fill twitter sm-box">
              <div className="social-likes">
                <p>Follow us on twitter</p>
                <h6>48,596</h6>
              </div>
              <div className="social-boxs">
                <img
                  src="assets/img/icons/social-icon-02.svg"
                  alt="Social Icon"
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card flex-fill insta sm-box">
              <div className="social-likes">
                <p>Follow us on instagram</p>
                <h6>52,085</h6>
              </div>
              <div className="social-boxs">
                <img
                  src="assets/img/icons/social-icon-03.svg"
                  alt="Social Icon"
                />
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card flex-fill linkedin sm-box">
              <div className="social-likes">
                <p>Follow us on linkedin</p>
                <h6>69,050</h6>
              </div>
              <div className="social-boxs">
                <img
                  src="assets/img/icons/social-icon-04.svg"
                  alt="Social Icon"
                />
              </div>
            </div>
          </div>
        </div>
        {/* /Socail Media Follows */}
      </div>
      {/* Footer */}
      <footer>
        <p>Copyright © 2023 Webwise Solution.</p>
      </footer>
      {/* /Footer */}
    </div>
  );
}

export default FacultyDashboard;
