import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext } from "../App";
import { axiosInstance } from "../utility/axiosInstance";

function LeaveHistory() {
  const { token, user } = useContext(userContext);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [filters, setFilters] = useState({
    facultyId: user._id,
    approvalStatus: selectedTab,
  });

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  useEffect(() => {
    document.title = "Leave History | College ERP";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `${
            network.server
          }/api/faculty/getfilteredleaverequests?filters=${JSON.stringify(
            filters
          )}`
        );
        setData(res.data); // Assuming 'res.data' contains fetched leave history
      } catch (err) {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [filters, token]);

  const handleTabChange = (tabName) => {
    setSelectedTab(tabName);
    setFilters({ ...filters, approvalStatus: tabName });
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Leave History</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card card-table">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="card bg-white">
                      <div className="card-body">
                        <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified">
                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                selectedTab === "pending" ? "active" : ""
                              }`}
                              onClick={() => handleTabChange("pending")}
                            >
                              Pending
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                selectedTab === "approved" ? "active" : ""
                              }`}
                              onClick={() => handleTabChange("approved")}
                            >
                              Approved
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${
                                selectedTab === "declined" ? "active" : ""
                              }`}
                              onClick={() => handleTabChange("declined")}
                            >
                              Declined
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content">
                    <div
                      className={`tab-pane ${
                        selectedTab === "pending" ? "show active" : ""
                      }`}
                    >
                      <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                        <thead className="student-thread">
                          <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Applied On</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Map 'data' and render pending requests */}
                          {data.map((item) => (
                            <tr key={item.id}>
                              <td>{formatDate(item.leaveFrom)}</td>
                              <td>{formatDate(item.leaveTo)}</td>
                              <td>{formatDate(item.appliedOn)}</td>
                              <td>
                                <span className="badge badge-soft-warning badge-border">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div
                      className={`tab-pane ${
                        selectedTab === "approved" ? "show active" : ""
                      }`}
                    >
                      <div className="table-responsive">
                        <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                          <thead className="student-thread">
                            <tr>
                              <th>From</th>
                              <th>To</th>
                              <th>Applied On</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr key={item.id}>
                                <td>{formatDate(item.leaveFrom)}</td>
                                <td>{formatDate(item.leaveTo)}</td>
                                <td>{formatDate(item.appliedOn)}</td>
                                <td>
                                  <span className="badge badge-soft-success badge-border">
                                    Approved
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      className={`tab-pane ${
                        selectedTab === "declined" ? "show active" : ""
                      }`}
                    >
                      <div className="table-responsive">
                        <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                          <thead className="student-thread">
                            <tr>
                              <th>From</th>
                              <th>To</th>
                              <th>Applied On</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr key={item.id}>
                                <td>{formatDate(item.leaveFrom)}</td>
                                <td>{formatDate(item.leaveTo)}</td>
                                <td>{formatDate(item.appliedOn)}</td>
                                <td>
                                  <span className="badge badge-soft-danger badge-border">
                                    Declined
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
    </div>
  );
}

export default LeaveHistory;
