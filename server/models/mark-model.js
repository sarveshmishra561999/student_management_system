const mongoose = require('mongoose');
const markSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    subject: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
  })
  const Marks = new mongoose.model("Mark", markSchema)
module.exports = Marks;