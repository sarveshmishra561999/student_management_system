const express = require("express")
const router = express.Router();
const studentcontrollers = require("../controllers/student-controller")


router.route("/students").post(studentcontrollers.createStudent)
router.route("/students").get(studentcontrollers.GetStudent)
router.route("/students/:id").get(studentcontrollers.getStudentById)
router.route("/students/:id").put(studentcontrollers.updateStudent)
router.route("/students/:id").delete(studentcontrollers.deleteStudent)
router.route("/result/:id").get(studentcontrollers.getResult)




module.exports = router