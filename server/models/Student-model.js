const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
  });

const Student = new mongoose.model("Student", studentSchema)
module.exports = Student;