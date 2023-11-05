import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
function Faculty() {
    const [faculty, setFaculty] = useState([
        {
            id: '',
            name: '',
            email: ''
        }
    ])

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
                      <th>ID</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Subject</th>
                      <th>Section</th>
                      <th>Mobile Number</th>
                      <th>Address</th>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Aaliyah</a>
                        </h2>
                      </td>
                      <td>10</td>
                      <td>Female</td>
                      <td>Mathematics</td>
                      <td>A</td>
                      <td>097 3584 5870</td>
                      <td>911 Deer Ridge Drive,USA</td>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-03.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Malynne</a>
                        </h2>
                      </td>
                      <td>8</td>
                      <td>Female</td>
                      <td>Physics</td>
                      <td>A</td>
                      <td>242 362 3100</td>
                      <td>Bacardi Rd P.O. Box N-4880, New Providence</td>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-04.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Levell&nbsp;Scott</a>
                        </h2>
                      </td>
                      <td>10</td>
                      <td>Male</td>
                      <td>Science</td>
                      <td>B</td>
                      <td>026 7318 4366</td>
                      <td>P.O. Box: 41, Gaborone</td>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-05.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Minnie</a>
                        </h2>
                      </td>
                      <td>11</td>
                      <td>Male</td>
                      <td>History</td>
                      <td>C</td>
                      <td>952 512 4909</td>
                      <td>4771 Oral Lake Road, Golden Valley</td>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-06.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Lois&nbsp;A</a>
                        </h2>
                      </td>
                      <td>10</td>
                      <td>Female</td>
                      <td>English</td>
                      <td>B</td>
                      <td>413 289 1314</td>
                      <td>2844 Leverton Cove Road, Palmer</td>
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
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-07.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Calvin</a>
                        </h2>
                      </td>
                      <td>9</td>
                      <td>Male</td>
                      <td>Mathematics</td>
                      <td>C</td>
                      <td>701 753 3810</td>
                      <td>1900 Hidden Meadow Drive, Crete</td>
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
                      <td>PRE1434</td>
                      <td>
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-08.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Vincent</a>
                        </h2>
                      </td>
                      <td>10</td>
                      <td>Male</td>
                      <td>Mathematics</td>
                      <td>C</td>
                      <td>402 221 7523</td>
                      <td>3979 Ashwood Drive, Omaha</td>
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
                      <td>PRE2345</td>
                      <td>
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-09.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">
                            Kozma&nbsp;&nbsp;Tatari
                          </a>
                        </h2>
                      </td>
                      <td>9</td>
                      <td>Female</td>
                      <td>Science</td>
                      <td>A</td>
                      <td>04 2239 968</td>
                      <td>Rruga E Kavajes, Condor Center, Tirana</td>
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
                      <td>PRE2365</td>
                      <td>
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-10.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">John Chambers</a>
                        </h2>
                      </td>
                      <td>11</td>
                      <td>Male</td>
                      <td>Botony</td>
                      <td>B</td>
                      <td>870 663 2334</td>
                      <td>4667 Sunset Drive, Pine Bluff</td>
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
                      <td>PRE1234</td>
                      <td>
                        <h2 className="table-avatar">
                          <a
                            href="teacher-details.html"
                            className="avatar avatar-sm me-2"
                          >
                            <img
                              className="avatar-img rounded-circle"
                              src="assets/img/profiles/avatar-11.jpg"
                              alt="User Image"
                            />
                          </a>
                          <a href="teacher-details.html">Nathan Humphries</a>
                        </h2>
                      </td>
                      <td>10</td>
                      <td>Male</td>
                      <td>Biology</td>
                      <td>A</td>
                      <td>077 3499 9959</td>
                      <td>86 Lamphey Road, Thelnetham</td>
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
  )
}

export default Faculty
