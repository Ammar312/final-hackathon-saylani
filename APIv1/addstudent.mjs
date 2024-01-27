import express from "express";
import { client } from "../mongodb.mjs";
import upload from "../middlewares/multermiddleware.mjs";
import { uploadCloudinary, deleteImg } from "../utilis/cloudinary.mjs";
import { stringToHash } from "bcrypt-inzi";
import { ObjectId } from "mongodb";
const router = express.Router();
const db = client.db("finalhackathon");
const dbCollection = db.collection("users");

router.post("/addstudent", upload, async (req, res) => {
  const file = req.file;
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
      const img = await uploadCloudinary(file.path);
      const passwordHash = await stringToHash(req.body.password);
      const addStudent = await dbCollection.insertOne({
        publicId: img.public_id,
        assetId: img.asset_id,
        imgUrl: img.secure_url,
        isAdmin: false,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        course: req.body.course,
        showPassword: req.body.password,
        password: passwordHash,
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
    const doc = await dbCollection.findOne({ _id: new ObjectId(id) });
    const deletepublicId = doc.publicId;
    console.log("doc", doc);
    await dbCollection.deleteOne({ _id: new ObjectId(id) });
    await deleteImg(deletepublicId);
    res.send({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(404).send("Not Found");
  }
});
router.put("/editstudent/:studentid", async (req, res) => {
  const id = req.params.studentid;
  if (!ObjectId.isValid(id)) {
    res.status(403).send(`Invalid student id`);
    return;
  }

  let updatedData = {};
  if (req.body.firstName) {
    updatedData.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    updatedData.lastName = req.body.lastName;
  }
  if (req.body.course) {
    updatedData.course = req.body.course;
  }
  if (req.body.showPassword) {
    updatedData.password = req.body.showPassword;
    updatedData.showPassword = req.body.showPassword;
  }
  if (req.body.email) {
    updatedData.email = req.body.email;
  }
  if (req.body.phoneNumber) {
    updatedData.phoneNumber = req.body.phoneNumber;
  }
  try {
    const updatedResponse = await dbCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatedData,
      }
    );
    res.send("Post Updated Successfully");
  } catch (error) {
    res.status(500).send("server error, please try later");
  }
});

export default router;
