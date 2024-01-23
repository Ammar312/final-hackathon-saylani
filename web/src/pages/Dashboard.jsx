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

// const items = [
//   {
//     label: (
//       <Popconfirm
//         title="Delete the task"
//         description="Are you sure to delete this task?"
//         onConfirm={(e) => deleteStudent()}
//         // onCancel={cancel}
//         okText="Yes"
//         cancelText="No"
//       >
//         Delete
//       </Popconfirm>
//     ),
//     // key: "0",
//   },
// ];

{
  /* <div className="m-4">
<div className="flex justify-evenly bg-blue-400 text-white py-5">
 <span>id</span>
 <span>Profile</span>
 <span>Name</span>
 <span>Course Name</span>
 <span>Password</span>
</div> 

<div className="my-8 border-black border max-h-[400px] overflow-y-auto ">
 {allStudents.map((eachStudent, index) => {
   return (
     <div
       className="flex justify-evenly items-center text-black shadow-lg py-5"
       key={index}
     >
       <span>{index}</span>
       <span>
          <i className="bi bi-person text-blue-400 mr-3"></i> 
         <img
           src={eachStudent.imgUrl || ""}
           alt=""
           className="w-[50px]"
         />
       </span>
       <span className="text-center">
         {eachStudent.firstName + eachStudent.lastName}
       </span>
       <span className="text-center">{eachStudent.course}</span>
       <span className="text-center">{eachStudent.password}</span>
       <Dropdown
         menu={
           <>
             <Popconfirm
               title="Delete the task"
               description="Are you sure to delete this task?"
               onConfirm={(e) => deleteStudent(eachStudent._id)}
               // onCancel={cancel}
               okText="Yes"
               cancelText="No"
             >
               Delete
             </Popconfirm>
             <div>
               <span>Edit</span>
             </div>
           </>
         }
         trigger={["click"]}
       >
         <i
           className="bi bi-three-dots-vertical"
           id={eachStudent._id}
         />
       </Dropdown>
     </div>
   );
 })}
</div> 
</div> */
}
