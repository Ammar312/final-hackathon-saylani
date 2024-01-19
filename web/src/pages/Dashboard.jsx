import React, { useContext } from "react";
import { GlobalContext } from "../context/context";
import axios from "axios";
import { baseURL } from "../core";
import { Link } from "react-router-dom";
import StudentSection from "../components/StudentSection";

const Dashboard = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const logoutHandle = async () => {
    try {
      const response = await axios.post(
        `${baseURL}api/v1/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "USER_LOGOUT",
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <div className=" flex w-full max-h-screen overflow-hidden">
        <div className=" flex flex-col justify-between w-80 border p-6 min-h-screen shadow-2xl">
          <div className="flex flex-col gap-2 justify-between">
            <div className=" text-blue-400 text-4xl text-center mb-8">
              Attendance App
            </div>
            <div className="text-2xl text-gray-500 py-4 hover:bg-gray-100">
              <i className="bi bi-person text-blue-400 mr-3"></i>
              Students
            </div>
            <div className="text-2xl text-gray-500 py-4 hover:bg-gray-100">
              <i className="bi bi-file-person-fill text-blue-400 mr-3"></i>
              Attendance
            </div>
          </div>
          <div className="">
            <button
              onClick={logoutHandle}
              className="p-1 m-2 border-2 border-blue-400 text-blue-500 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        <div>
          <StudentSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
