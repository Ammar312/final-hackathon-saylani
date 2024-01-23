import express from "express";
import { client } from "../mongodb.mjs";
import upload from "../middlewares/multermiddleware.mjs";
import uploadCloudinary from "../utilis/cloudinary.mjs";
import { ObjectId } from "mongodb";
const router = express.Router();
const db = client.db("finalhackathon");
const dbCollection = db.collection("students");

router.post("/addstudent", upload, async (req, res) => {
  const body = req.body;
  const file = req.file;

  console.log("filepath2", req.file.path);
  if (
    // !req.body.studentPic ||
    !file ||
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password
  ) {
    res.status(403).send({ message: "Required Paramater Missing" });
    return;
  }
  if (file.size > 2000000) {
    // size bytes, limit of 2MB
    res.status(403).send({ message: "File size limit exceed, max limit 2MB" });
    return;
  }

  const emailInLower = req.body.email.toLowerCase();
  try {
    const isInclude = await dbCollection.findOne({
      email: emailInLower,
    });
    if (!isInclude) {
      const imgUrl = await uploadCloudinary(file.path);
      console.log("imgUrl", imgUrl);

      const addStudent = await dbCollection.insertOne({
        imgUrl: imgUrl.secure_url,
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
  // console.log("allStudentsintoarray :", allStudentsIntoArray);

  res.send(allStudentsIntoArray);
});

router.delete("/deletestudent/:studentid", async (req, res) => {
  const id = req.params.studentid;
  if (!ObjectId.isValid(id)) {
    res.status(403).send(`Invalid student id`);
    return;
  }
  try {
    await dbCollection.deleteOne({ _id: new ObjectId(id) });
    res.send({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(404).send("Not Found");
  }
});

export default router;
