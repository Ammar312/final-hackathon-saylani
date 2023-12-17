import React, { useState } from "react";
import { Button, Modal } from "antd";

const StudentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="border-2 border-red-400 p-6 w-full">
      <header className="flex justify-between w-full h-full p-2 items-center">
        <div>
          <span className="p-4 rounded-full bg-black">
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
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default StudentSection;
