import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:5000/api/auth'; 

const Crud = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    subjects: [{ subject: '', score: '' }]
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentMarks, setSelectedStudentMarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalEntities, setTotalEntities] = useState(0);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students?page=${page}`);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTotalEntities(response.data.totalEntities);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (index, e) => {
    const { name, value } = e.target;
    const subjects = [...formData.subjects];
    subjects[index][name] = value;
    setFormData({ ...formData, subjects });
  };
  

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
    setSelectedStudentId(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      age: '',
      subjects: [{ subject: '', score: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudentId) {
        await axios.put(`${API_BASE_URL}/students/${selectedStudentId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/students`, formData);
      }
      await fetchStudents(currentPage);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        subjects: [{ subject: '', score: '' }]
      });
      setShowCreateForm(false);
      setSelectedStudentId(null);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: selectedStudentId ? 'Member updated successfully' : 'New member created successfully'
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
  };
  

  const handleEdit = (studentId) => {
    const selectedStudent = students.find(student => student._id === studentId);
    setSelectedStudentId(studentId);
    setFormData({
      first_name: selectedStudent.first_name,
      last_name: selectedStudent.last_name,
      email: selectedStudent.email,
      age: selectedStudent.age,
      subjects: selectedStudent.subjects
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (studentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this student data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/students/${studentId}`);
          await fetchStudents(currentPage);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Student data has been deleted.'
          });
        } catch (error) {
          console.error('Error deleting student:', error);
        }
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject: '', score: '' }]
    });
  };

  const handleShowResult = async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/result/${studentId}`);
      setSelectedStudentMarks(response.data);
    } catch (error) {
      console.error('Error fetching student marks:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <h2 className="my-4">Student Management System</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mb-4 float-right"
        onClick={handleCreateFormToggle}
      >
        {showCreateForm ? 'Close Form' : 'Create New Member'}
      </button>
      {showCreateForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            {formData.subjects.map((subject, index) => (
              <div className="form-group col-md-6" key={index}>
                <label>Subject Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={subject.subject}
                  onChange={(e) => handleSubjectChange(index, e)}
                  required
                />
                <label>Score</label>
                <input
                  type="number"
                  className="form-control"
                  name="score"
                  value={subject.score}
                  onChange={(e) => handleSubjectChange(index, e)}
                  required
                />
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary mr-2"
            onClick={handleAddSubject}
            type="button"
          >
            Add Subject
          </button>
          <button className="btn btn-success" type="submit">
            {selectedStudentId ? 'Update Member' : 'Create Member'}
          </button>
        </form>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>
                <button
                  className="btn btn-info mr-2"
                  onClick={() => handleShowResult(student._id)}
                >
                  Show Result
                </button>
                <button
                  className="btn btn-warning mr-2"
                  onClick={() => handleEdit(student._id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(student._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages).keys()].map((page) => (
            <li
              className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
              key={page}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div className="text-left">
        Total Entities: {totalEntities}
      </div>
      {selectedStudentMarks.length > 0 && (
        <div className="mt-4">
          <h4>Student Marks</h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudentMarks.map((subject, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{subject.subject}</td>
                  <td>{subject.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Crud;
