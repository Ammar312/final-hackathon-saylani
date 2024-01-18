import express from "express";
import { client } from "../mongodb.mjs";
const router = express.Router();
const db = client.db("finalhackathon");
const dbCollection = db.collection("students");

router.post("/addstudent", async (req, res) => {
  if (
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password
  ) {
    res.status(403).send({ message: "Required Paramater Missing" });
    return;
  }
  const emailInLower = req.body.email.toLowerCase();
  try {
    const isInclude = await dbCollection.findOne({
      email: emailInLower,
    });
    if (!isInclude) {
      const addStudent = await dbCollection.insertOne({
        isAdmin: false,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        course: req.body.course,
        password: req.body.password,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        createdOn: new Date(),
      });
      res.send({ message: "Student Enroll Successfully" });
    } else {
      res.status(403).send({
        message: "User already exist with this email",
      });
    }
  } catch (error) {
    console.log("error getting data mongodb: ", error);
    res.status(500).send("Server Error, Please try later");
  }
});
router.get("/allstudent", async (req, res) => {
  const allStudents = dbCollection.find({});
  const allStudentsIntoArray = await allStudents.toArray();
  console.log("allStudentsintoarray :", allStudentsIntoArray);

  res.send(allStudentsIntoArray);
});

export default router;
