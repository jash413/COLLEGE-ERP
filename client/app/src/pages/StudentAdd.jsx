import React, {useState,useContext} from "react";
import { Link } from "react-router-dom";
import network from "../config/network";
import axios from "axios";
import { toast } from "react-hot-toast";
import { userContext } from "../App";
 
function StudentAdd() {
  const { token } = useContext(userContext);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    gender: "",
    dob: "",
    batch: "",
    enrollmentNumber: "",
    email: "",
    contact: "",
    fatherName: "",
    motherName: "",
    fatherContactNumber: "",
    motherContactNumber: "",
    year: "",
  });

  // handle form data
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${network.server}/api/admin/addstudent`, formData, {
        headers: { Authorization: `Bearer ${token}` }
        });
      toast.success(res.data.message);
      setFormData({
        name: "",
        department: "",
        gender: "",
        dob: "",
        batch: "",
        enrollmentNumber: "",
        email: "",
        contact: "",
        fatherName: "",
        motherName: "",
        fatherContactNumber: "",
        motherContactNumber: "",
        year: "",
      });
    } catch (error) {
      console.log(formData)
      if(error.response.data.emailError){ 
      toast.error(error.response.data.emailError);
      }else{
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-sm-12">
                <div className="page-sub-header">
                  <h3 className="page-title">Add Students</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/student/list">Student</Link>
                    </li>
                    <li className="breadcrumb-item active">Add Students</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card comman-shadow">
                <div className="card-body">
                  <form onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <h5 className="form-title student-info">
                          Student Information{" "}
                          <span>
                            <a href="javascript:;">
                              <i className="feather-more-vertical" />
                            </a>
                          </span>
                        </h5>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Name <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter First Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Department <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Department Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Gender <span className="login-danger">*</span>
                          </label>
                          <select name="gender" value={formData.gender} onChange={handleFormData} className="form-control select">
                            <option value="Select Gender" disabled>Select Gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="others">Others</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms calendar-icon">
                          <label>
                            Date Of Birth{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control datetimepicker"
                            name="dob"
                            value={formData.dob}
                            onChange={handleFormData}
                            type="text"
                            placeholder="DD-MM-YYYY"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Batch <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="batch"
                            value={formData.batch}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Batch Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Enrollment Number <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="enrollmentNumber"
                            value={formData.enrollmentNumber}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Enrollment Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            E-Mail <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="contact"
                            value={formData.contact}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Contact Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Father Name <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Father Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Mother Name <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleFormData}
                            type="text"
                            placeholder="Enter Mother Name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                           Father Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="fatherContactNumber"
                            value={formData.fatherContactNumber}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Father Contact Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                           Mother Contact Number <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="motherContactNumber"
                            value={formData.motherContactNumber}
                            onChange={handleFormData}
                            type="number"
                            placeholder="Enter Mother Contact Number"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>
                            Year <span className="login-danger">*</span>
                             </label>
                          <input
                            className="form-control"
                            name="year"
                            value={formData.year}
                            onChange={handleFormData}
                            type="text"
                            placeholder="yyyy"
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
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
      </div>
    </>
  );
}

export default StudentAdd;
