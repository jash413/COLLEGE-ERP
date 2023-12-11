import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { userContext } from "../App";
import ContentLoader from "react-content-loader";
import { facultyContext } from "../App";
// Content Loader according to table row
const MyLoader = () => (
  <ContentLoader
    speed={2}
    width={1000}
    height={31} // Adjust the height according to your row height
    viewBox="0 0 1000 31" // Update the viewBox size as needed
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {/* Customize the SVG shapes to mimic your row data structure */}
    {/* Example: Name, Email, Year, Gender, DOB, etc. */} 
    <rect x="10" y="5" rx="3" ry="3" width="100" height="10" />
    <rect x="120" y="5" rx="3" ry="3" width="200" height="10" />
    <rect x="350" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="410" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="470" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="530" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="590" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="650" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="710" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="770" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="830" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="890" y="5" rx="3" ry="3" width="50" height="10" />
    <rect x="950" y="5" rx="3" ry="3" width="50" height="10" />
    {/* Add more shapes to represent other data */}
  </ContentLoader>
);

function MenteeStudents() {
  const { token } = useContext(userContext);
  const [faculty] = useContext(facultyContext);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const { user } = useContext(userContext);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/admin/getAllStudent?page=${page}&faculty=${selectedFaculty}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    console.log(selectedFaculty)
  }, [currentPage]);

  useEffect(() => {
  
    // If user is a faculty, set selectedFaculty to faculty's shortName
    if (user.type === 'faculty') {
      setSelectedFaculty(faculty.shortName);
    }
  }, []);
  
  // In your render method
  {
    user.type === 'admin' && (
      <select onChange={handleFacultySelection}>
        {/* Populate this select with options for each faculty */}
      </select>
    )
  }

  const handleFacultySelection = (e) => {
    setSelectedFaculty(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const download = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/downloadstudentexcel",
        {
          responseType: "blob", // Set the response type to 'blob' to handle binary data
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Student_Excel.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="page-sub-header">
                <h3 className="page-title">Students List</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/student/list">Student</Link>
                  </li>
                  <li className="breadcrumb-item active">All Students</li>
                </ul>
              </div>
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
            <div className="card card-table comman-shadow">
              <div className="card-body">
                {/* Page Header */}
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col">
                    <h3 className="page-title">{faculty.shortName}</h3>
                    </div>
                    <div className="col-auto text-end float-end ms-auto download-grp">
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => {
                          download();
                        }}
                      >
                        <i className="fas fa-download" /> Download
                      </button>
                      <Link to="/student/add" className="btn btn-primary">
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Year</th>
                        <th>Gender</th>
                        <th>DOB</th>
                        <th>Father Name</th>
                        <th>Mother Name</th>
                        <th>Mobile Number</th>
                        <th>Department</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading &&
                        students
                        .filter(student => student.mentor.shortName === faculty.shortName)
                        .map((student)  => (
                          <tr>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.year}</td>
                            <td>{student.gender}</td>
                            <td>{student.dob}</td>
                            <td>{student.fatherName}</td>
                            <td>{student.motherName}</td>
                            <td>{student.contactNumber}</td>
                            <td>{student.department}</td>
                            <td className="text-end">
                              <div className="actions ">
                                <a
                                  href="javascript:;"
                                  className="btn btn-sm bg-success-light me-2 "
                                >
                                  <i className="feather-eye" />
                                </a>
                                <a
                                  href="edit-student.html"
                                  className="btn btn-sm bg-danger-light"
                                >
                                  <i className="feather-edit" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {loading && (
                        Array.from({ length: 10 }).map((_, index) => (  
                          <tr key={index}>
                            <td colSpan={10}>
                              <MyLoader />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <br />
                <div>
                  <ul className="pagination mb-4">
                    <li
                      className={`page-item ${currentPage === 1 && "disabled"}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          currentPage === page && "active"
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
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
export default MenteeStudents;