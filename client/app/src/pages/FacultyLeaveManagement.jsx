import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { userContext } from "../App";

function FacultyLeaveManagement() {
  const { token, user } = useContext(userContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    document.title = "Leave History | College ERP";
    fetchLeaveRequests();
  }, [token]);

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(
        `${network.server}/api/faculty/getfilteredleaverequests?filters={"approvalStatus":"pending"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data); // Assuming 'res.data' contains fetched leave history
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const approveLeave = async (id) => {
    try {
      await axios.patch(
        `${network.server}/api/admin/updateleaverequest/${id}`,
        {
          approvalStatus: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLeaveRequests();
      toast.success("Leave approved successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.patch(
        `${network.server}/api/admin/updateleaverequest/${id}`,
        {
          approvalStatus: "rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLeaveRequests();
      toast.success("Leave rejected successfully");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Leave Management</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card card-table">
              <div className="card-body">
              <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h3 className="page-title">Pending Requests</h3>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                    <thead className="student-thread">
                      <tr>
                        <th>Faculty</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Applied On</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr key={item._id}>
                          <td>{item.facultyId}</td>
                          <td>{formatDate(item.leaveFrom)}</td>
                          <td>{formatDate(item.leaveTo)}</td>
                          <td>{formatDate(item.appliedOn)}</td>
                            <td>{item.leaveReason}</td>
                          <td>
                            {item.approvalStatus === "pending" && (
                              <div>
                                <button
                                  className="btn btn-sm btn-success mr-2"
                                  onClick={() => approveLeave(item._id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => rejectLeave(item._id)}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
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
      <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
    </div>
  );
}

export default FacultyLeaveManagement;
