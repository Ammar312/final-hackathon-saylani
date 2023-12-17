import React, { useContext } from "react";
import { GlobalContext } from "../context/context";
import axios from "axios";
import { baseURL } from "../core";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { state, dispatch } = useContext(GlobalContext);
  return (
    <div>
      <div className="text-5xl ">DashBoard</div>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export default Dashboard;
