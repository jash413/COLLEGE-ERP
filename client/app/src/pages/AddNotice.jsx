import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import network from "../config/network";
import { userContext } from "../App";
import { toast } from "react-hot-toast";

function AddNotice({ onAdd }) {
  const { token } = useContext(userContext);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: "",
    date: "",
    content: "",
    title: "",
  });

  const fetchFaculty = async (inputValue) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${network.server}/api/admin/getfilteredfaculty?contactNumber=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      return response.data.map((faculty) => ({
        value: faculty._id,
        label: faculty.name,
      }));
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setIsLoading(false);
      return [];
    }
  };

  useEffect(() => {
    document.title = "Add Notice | College ERP";
  }, []);

  useEffect(() => {
    if (formData.to === "all") {
      setSelectedFaculty(null);
    }
  }, [formData.to]);

  const handleFacultyChange = (selectedOption) => {
    setSelectedFaculty(selectedOption);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${network.server}/api/admin/createnotice`,
        {
          ...formData,
          faculty: formData.to === "faculty" ? selectedFaculty.value : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAdd(response.data);
      toast.success("Notice added successfully");
      setFormData({
        to: "",
        date: "",
        content: "",
        faculty: selectedFaculty,
        title: "",
      });
      setSelectedFaculty(null);
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Create Notice</h3>
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
                        <span>Fill Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          To <span className="login-danger">*</span>
                        </label>
                        <select
                          className="form-control select"
                          name="to"
                          onChange={handleInputChange}
                          value={formData.to}
                          required
                        >
                          <option value="">Select</option>
                          <option value="all">For All Faculties</option>
                          <option value="faculty">Individual Faculty</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          Faculty <span className="login-danger">*</span>
                        </label>
                        <AsyncSelect
                          value={selectedFaculty}
                          isDisabled={formData.to !== "faculty"}
                          cacheOptions
                          defaultOptions
                          loadOptions={(inputValue, callback) => {
                            fetchFaculty(inputValue).then((data) => {
                              callback(data);
                            });
                          }}
                          placeholder="Search By Contact Number"
                          onChange={handleFacultyChange}
                          isLoading={isLoading}
                          noOptionsMessage={() => null}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms calendar-icon">
                        <label>
                          Date <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          onChange={handleInputChange}
                          value={formData.date}
                          type="date"
                          name="date"
                          className="form-control"
                          id="dob"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          Title <span className="login-danger">*</span>
                        </label>
                        <input
                          required
                          onChange={handleInputChange}
                          value={formData.title}
                          type="text"
                          name="title"
                          className="form-control"
                          placeholder="Enter Title"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6">
                      <div className="form-group local-forms">
                        <label>
                          Content <span className="login-danger">*</span>
                        </label>
                        <textarea
                          rows={5}
                          cols={5}
                          required
                          onChange={handleInputChange}
                          value={formData.content}
                          type="text"
                          name="content"
                          className="form-control"
                          placeholder="Enter Content"
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

export default AddNotice;
