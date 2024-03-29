import React, { useRef, useState, useEffect } from "react";
import { Modal, Dropdown, Popconfirm, Table, message } from "antd";
const { Column } = Table;
import axios from "axios";
import { baseURL } from "../core";

const StudentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
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
  const editFormRef = useRef();
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

  useEffect(() => {
    console.log("Student state changed", selectedStudentData);
  }, [selectedStudentData]);

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
      setToggleRefresh(!toggleRefresh);
      firstNameRef.current.value = "";
      lastNameRef.current.value = "";
      courseRef.current.value = "";
      passwordRef.current.value = "";
      emailRef.current.value = "";
      phoneNumberRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setImg(null);
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    courseRef.current.value = "";
    passwordRef.current.value = "";
    emailRef.current.value = "";
    phoneNumberRef.current.value = "";
  };

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(
        `${baseURL}api/v1/deletestudent/${id}`
      );
      setToggleRefresh(!toggleRefresh);
      console.log(response);
      setOpen(false);
    } catch (error) {
      // message.danger(`${error.message}`);
    }
  };
  const handleEditModal = (record) => {
    // setSelectedStudentData((prevRecord) => ({ ...prevRecord, ...record }));
    setSelectedStudentData(record);
    setIsEditModal(true);
  };

  const handleEdit = async (id) => {
    const firstName = editFormRef.current[0].value;
    const lastName = editFormRef.current[1].value;
    const course = editFormRef.current[2].value;
    const showPassword = editFormRef.current[3].value;
    const email = editFormRef.current[4].value;
    const phoneNumber = editFormRef.current[5].value;
    try {
      const response = await axios.put(`${baseURL}api/v1/editstudent/${id}`, {
        firstName,
        lastName,
        course,
        email,
        showPassword,
        phoneNumber,
      });
      setToggleRefresh(!toggleRefresh);
      setIsEditModal(false);
      setSelectedStudentData(null);
      editFormRef.current.reset();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditCancel = () => {
    setIsEditModal(false);
    setSelectedStudentData(null);
    editFormRef.current.reset();
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
          <Column
            title="Password"
            dataIndex="showPassword"
            key="showPassword"
          />
          <Column
            key="action"
            render={(text, record) => {
              return (
                <>
                  {!record.isAdmin && (
                    <Dropdown
                      // open={open}
                      // onOpenChange={handleOpenChange}
                      trigger={["click"]}
                      dropdownRender={() => (
                        <div className=" p-[6px] flex flex-col gap-2 bg-white rounded-lg shadow-xl cursor-pointer text-base">
                          <Popconfirm
                            title="Delete the task"
                            className="text-red-400 hover:bg-gray-100 px-3 py-1 flex-grow"
                            description="Are you sure to delete this task?"
                            onConfirm={() => deleteStudent(record._id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            Delete
                          </Popconfirm>
                          <div
                            className="text-green-400 hover:bg-gray-100 px-3 py-1 flex-grow "
                            onClick={() => handleEditModal(record)}
                          >
                            Edit
                          </div>
                        </div>
                      )}
                    >
                      <i className="bi bi-three-dots-vertical cursor-pointer" />
                    </Dropdown>
                  )}
                </>
              );
            }}
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
      <Modal
        title=""
        open={isEditModal}
        onOk={() => handleEdit(selectedStudentData._id)}
        onCancel={handleEditCancel}
      >
        <div className=" text-2xl mb-4">Edit Student</div>
        <form encType="multipart/form-data" ref={editFormRef}>
          <div className="flex flex-wrap gap-3">
            <div>
              <input
                type="text"
                placeholder="Firstname"
                className="p-2 border-2 rounded-md text-lg"
                // ref={firstNameRef}
                defaultValue={selectedStudentData?.firstName}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Lastname"
                className="p-2 border-2 rounded-md text-lg"
                // ref={lastNameRef}
                defaultValue={selectedStudentData?.lastName}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="course"
                className="p-2 border-2 rounded-md text-lg"
                // ref={courseRef}
                defaultValue={selectedStudentData?.course}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border-2 rounded-md text-lg"
                // ref={passwordRef}
                defaultValue={selectedStudentData?.showPassword}
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="p-2 border-2 rounded-md text-lg"
                // ref={emailRef}
                defaultValue={selectedStudentData?.email}
                required
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Phone Number"
                className="p-2 border-2 rounded-md text-lg"
                // ref={phoneNumberRef}
                defaultValue={selectedStudentData?.phoneNumber}
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
