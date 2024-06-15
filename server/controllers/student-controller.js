const Student = require("../models/Student-model");
const Mark = require("../models/mark-model");

const createStudent = async (req, res) => {
  const { first_name, last_name, email, age, subjects } = req.body;
  try {
    const newStudent = new Student({
      first_name,
      last_name,
      email,
      age
    });
    const savedStudent = await newStudent.save();
    const marks = subjects.map(subject => ({
      student_id: savedStudent._id,
      subject: subject.subject,
      score: subject.score
    }));
    await Mark.insertMany(marks);
    const studentMarks = await Mark.find({ student_id: savedStudent._id });

    res.json({ student: savedStudent, subjects: studentMarks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const GetStudent = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const students = await Student.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const studentIds = students.map(student => student._id);
    const subjects = await Mark.find({ student_id: { $in: studentIds } });
    const studentsWithSubjects = students.map(student => {
      const studentSubjects = subjects.filter(subject => subject.student_id.equals(student._id));
      return {
        ...student.toObject(), 
        subjects: studentSubjects
      };
    });

    const count = await Student.countDocuments();
    res.json({
      students: studentsWithSubjects,
      totalPages: Math.ceil(count / limit),
      totalEntities: count,
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


  
  let getStudentById=async (req, res) => {
    const { id } = req.params;
    try {
      const student = await Student.findById(id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  let updateStudent = async (req, res) => {
    const { first_name, last_name, email, age, subjects } = req.body;
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { $set: { first_name, last_name, email, age } },
        { new: true }
      );
        if (subjects && subjects.length > 0) {
        await Mark.deleteMany({ student_id: req.params.id });
          const marks = subjects.map(subject => ({
          student_id: req.params.id,
          subject: subject.subject,
          score: subject.score
        }));
        await Mark.insertMany(marks);
      }
  
      res.json(updatedStudent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  
  let deleteStudent= async (req, res) => {
    try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Student removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  }
  let getResult= async (req, res) => {
    try {
      const marks = await Mark.find({ student_id: req.params.id });
      res.json(marks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  module.exports={createStudent,GetStudent,getStudentById,updateStudent,deleteStudent,getResult}