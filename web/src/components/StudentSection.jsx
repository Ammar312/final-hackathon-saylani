import React, { useRef, useState, useEffect } from "react";
import { Button, Modal, Dropdown, Space, Popconfirm, Table } from "antd";
const { Column, ColumnGroup } = Table;
import axios from "axios";
import { baseURL } from "../core";

const StudentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [img, setImg] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const picRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const courseRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
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
    setImg(null);

    const formData = new FormData();
    formData.append("studentPic", picRef.current.files[0]);
    formData.append("firstName", firstNameRef.current.value);
    formData.append("lastName", lastNameRef.current.value);
    formData.append("course", courseRef.current.value);
    formData.append("password", passwordRef.current.value);
    formData.append("email", emailRef.current.value);
    formData.append("phoneNumber", phoneNumberRef.current.value);
    console.log("picRef", picRef.current.files[0]);
    console.log("formdata", formData);
    try {
      const response = await axios.post(
        `${baseURL}api/v1/addstudent`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log(response);
      console.log(formData);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImg(null);
  };

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}api/v1/addstudent/${id}`);
      setToggleRefresh(!toggleRefresh);
      console.log(response);
    } catch (error) {}
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
        <Table
          dataSource={allStudents}
          pagination={{
            defaultPageSize: 5,
            pageSize: 6,
            responsive: true,
          }}
        >
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />

          <Column
            title="Profile"
            dataIndex="imgUrl"
            key="imgUrl"
            render={(text, record) => (
              <img
                src={record.imgUrl || ""}
                alt="imgUrl"
                className="w-[50px]"
              />
            )}
          />
          <Column title="Course" dataIndex="course" key="course" />
          <Column title="Password" dataIndex="password" key="password" />
          <Column
            key="action"
            render={(text, record) => (
              <i className="bi bi-three-dots-vertical" id={record._id} />
            )}
          />
        </Table>
      </div>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className=" text-2xl mb-4">Add Student</div>
        <form encType="multipart/form-data">
          <div className="flex justify-center">
            <label
              htmlFor="studentPic"
              className="bg-black text-center rounded-full w-[60px] h-[60px] overflow-hidden flex justify-center items-center"
            >
              {img ? (
                <img
                  src={img}
                  alt=""
                  className="w-[60px] h-[60px] object-cover rounded-full"
                />
              ) : (
                <i className="bi bi-person text-blue-400 mr-3 text-[40px]  mx-auto"></i>
              )}
            </label>
            <input
              type="file"
              className="hidden"
              id="studentPic"
              ref={picRef}
              accept="image/*"
              onChange={(e) => {
                const base64Url = URL.createObjectURL(e.target.files[0]);
                setImg(base64Url);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <input
                type="text"
                placeholder="Firstname"
                className="p-2 border-2 rounded-md text-lg"
                ref={firstNameRef}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Lastname"
                className="p-2 border-2 rounded-md text-lg"
                ref={lastNameRef}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="course"
                className="p-2 border-2 rounded-md text-lg"
                ref={courseRef}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border-2 rounded-md text-lg"
                ref={passwordRef}
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="p-2 border-2 rounded-md text-lg"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Phone Number"
                className="p-2 border-2 rounded-md text-lg"
                ref={phoneNumberRef}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentSection;
