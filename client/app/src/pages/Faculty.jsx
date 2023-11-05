import React, { useContext } from "react";
import { facultyContext } from "../App";
import { Link } from "react-router-dom";

function Faculty() {
  const [faculty] = useContext(facultyContext);
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Faculties</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Faculties</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="student-group-form">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by ID ..."
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name ..."
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Phone ..."
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="search-student-btn">
                <button type="btn" className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card card-table">
              <div className="card-body">
                {/* Page Header */}
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h3 className="page-title">Faculties</h3>
                    </div>
                    <div className="col-auto text-end float-end ms-auto download-grp">
                      <a href="#" className="btn btn-outline-primary me-2">
                        <i className="fas fa-download" /> Download
                      </a>
                      <Link to="/faculty/add" className="btn btn-primary">
                        <i className="fas fa-plus" />
                      </Link>
                    </div>
                  </div>
                </div>
                {/* /Page Header */}
                <div className="table-responsive">
                  <table className="table border-0 star-student table-hover table-center mb-0 datatable table-striped">
                    <thead className="student-thread">
                      <tr>
                        <th>
                          <div className="form-check check-tables">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue="something"
                            />
                          </div>
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Contact Number</th>
                        <th>DOB</th>
                        <th>Joining Year</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faculty.map((faculty) => (
                        <tr>
                          <td>
                            <div className="form-check check-tables">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue="something"
                              />
                            </div>
                          </td>
                          <td>{faculty.name}</td>
                          <td>{faculty.email}</td>
                          <td>{faculty.gender}</td>
                          <td>{faculty.designation}</td>
                          <td>{faculty.department}</td>
                          <td>{faculty.contactNumber}</td>
                          <td>{faculty.dob}</td>
                          <td>{faculty.joiningYear}</td>
                          <td className="text-end">
                            <div className="actions">
                              <a
                                href="javascript:;"
                                className="btn btn-sm bg-success-light me-2"
                              >
                                <i className="feather-eye" />
                              </a>
                              <a
                                href="edit-teacher.html"
                                className="btn btn-sm bg-danger-light"
                              >
                                <i className="feather-edit" />
                              </a>
                            </div>
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
      {/* Footer */}
      <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
      {/* /Footer */}
    </div>
  );
}

export default Faculty;
