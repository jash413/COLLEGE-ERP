import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import network from "../config/network";
import { useState, useContext, useEffect } from "react";
import { userContext } from "../App";

function CreateLeaveRequest() {
  const { token, user } = useContext(userContext);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    reason: "",
  });

  useEffect(() => {
    document.title = "Leave Request | College ERP";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${network.server}/api/faculty/createleaverequest`,
        {
          facultyId: user._id,
          leaveFrom: formData.from,
          leaveTo: formData.to,
          leaveReason: formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Leave Request Created Successfully");
      setFormData({
        faculty: user._id,
        from: "",
        to: "",
        reason: "",
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Create Leave Request</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="departments.html">Leaves</a>
                </li>
                <li className="breadcrumb-item active">Create Leave</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Leave Details</span>
                      </h5>
                    </div>

                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          From <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          id="from"
                          placeholder="From"
                          name="from"
                          value={formData.from}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              from: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          To <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          type="date"
                          className="form-control"
                          id="to"
                          placeholder="To"
                          name="to"
                          value={formData.to}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              to: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          Reason <span className="login-danger">*</span>
                        </label>
                        <textarea
                          required
                          type="text"
                          className="form-control"
                          id="reason"
                          placeholder="Mention Reason"
                          name="reason"
                          value={formData.reason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reason: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="student-submit">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Copyright © 2022 Webwise Solutions.</p>
      </footer>
    </div>
  );
}
export default CreateLeaveRequest;
