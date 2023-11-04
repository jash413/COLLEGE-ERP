import React from "react";

function Departments() {
    return (
        <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Departments</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="index.html">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Departments</li>
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
                    placeholder="Search by Year ..."
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
                        <h3 className="page-title">Departments</h3>
                      </div>
                      <div className="col-auto text-end float-end ms-auto download-grp">
                        <a href="#" className="btn btn-outline-primary me-2">
                          <i className="fas fa-download" /> Download
                        </a>
                        <a href="add-department.html" className="btn btn-primary">
                          <i className="fas fa-plus" />
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* /Page Header */}
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
                        <th>ID</th>
                        <th>Name</th>
                        <th>HOD</th>
                        <th>Started Year</th>
                        <th>No of Students</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
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
                        <td>PRE2209</td>
                        <td>
                          <h2>
                            <a>Computer Science Engg</a>
                          </h2>
                        </td>
                        <td>Aaliyah</td>
                        <td>1995</td>
                        <td>180</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
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
                        <td>PRE2213</td>
                        <td>
                          <h2>
                            <a>Mechanical Engg</a>
                          </h2>
                        </td>
                        <td>Malynne</td>
                        <td>1999</td>
                        <td>240</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
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
                        <td>PRE2143</td>
                        <td>
                          <h2>
                            <a>Electrical Engg</a>
                          </h2>
                        </td>
                        <td>Levell&nbsp;Scott</td>
                        <td>1994</td>
                        <td>163</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
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
                        <td>PRE2431</td>
                        <td>
                          <h2>
                            <a>Civil Engg</a>
                          </h2>
                        </td>
                        <td>Minnie</td>
                        <td>2000</td>
                        <td>195</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
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
                        <td>PRE1534</td>
                        <td>
                          <h2>
                            <a>MCA</a>
                          </h2>
                        </td>
                        <td>Lois&nbsp;A</td>
                        <td>1992</td>
                        <td>200</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
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
                        <td>PRE2153</td>
                        <td>
                          <h2>
                            <a>BCA</a>
                          </h2>
                        </td>
                        <td>Calvin</td>
                        <td>1992</td>
                        <td>152</td>
                        <td className="text-end">
                          <div className="actions">
                            <a
                              href="javascript:;"
                              className="btn btn-sm bg-success-light me-2"
                            >
                              <i className="feather-eye" />
                            </a>
                            <a
                              href="edit-department.html"
                              className="btn btn-sm bg-danger-light"
                            >
                              <i className="feather-edit" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer>
          <p>Copyright © 2022 Dreamguys.</p>
        </footer>
        {/* /Footer */}
      </div>
      
    )
}
export default Departments;