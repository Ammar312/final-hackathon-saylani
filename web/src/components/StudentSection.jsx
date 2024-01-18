import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "antd";
import axios from "axios";
import { baseURL } from "../core";

const StudentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}api/v1/allstudent`, {
          withCredentials: true,
        });
        setAllStudents(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [toggleRefresh]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    console.log("handleok work");
    console.log(inputRef);
    const firstName = inputRef.current[0].value;
    const lastName = inputRef.current[1].value;
    const course = inputRef.current[2].value;
    const password = inputRef.current[3].value;
    const email = inputRef.current[4].value;
    const phoneNumber = inputRef.current[5].value;
    console.log(firstName);
    try {
      const response = await axios.post(`${baseURL}api/v1/addstudent`, {
        firstName,
        lastName,
        course,
        password,
        email,
        phoneNumber,
      });
      console.log(response);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="p-6 w-full">
      <header className="flex justify-between w-[980px] h-full p-2 items-center shadow-md ">
        <div>
          <span className="p-4 rounded-full bg-black mr-3">
            <i className="bi bi-person text-blue-400 text-xl "></i>
          </span>
          <span className="text-3xl">Students</span>
        </div>
        <div>
          <button className="bg-blue-500 p-4 rounded-md" onClick={showModal}>
            <span className="p-2 rounded-full bg-white text-blue-400">
              <i className="bi bi-plus"></i>
            </span>
            <span className=" text-white ml-2">Add Student</span>
          </button>
        </div>
      </header>
      <div className="m-4">
        <div className="flex justify-evenly bg-blue-400 text-white py-5">
          <span>id</span>
          <span>Profile</span>
          <span>Name</span>
          <span>Course Name</span>
          <span>Password</span>
        </div>

        <div className="my-8">
          {allStudents.map((eachStudent, index) => {
            return (
              <div
                className="flex justify-evenly items-center text-black shadow-lg py-5"
                key={index}
              >
                <span>{index}</span>
                <span>
                  <i className="bi bi-person text-blue-400 mr-3"></i>
                </span>
                <span>{eachStudent.firstName + eachStudent.lastName}</span>
                <span>{eachStudent.course}</span>
                <span>{eachStudent.password}</span>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className=" text-2xl mb-4">Add Student</div>
        <form className="flex flex-wrap gap-3" ref={inputRef}>
          <div>
            <input
              type="text"
              placeholder="Firstname"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Lastname"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="course"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Phone Number"
              className="p-2 border-2 rounded-md text-lg"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentSection;
