import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import Msg from "./Msg";
import axios from "axios";
import { useLocalStorage } from "react-use";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [user, setuser] = useLocalStorage("username", "");
  const [email, setemail] = useLocalStorage("emali", "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData
      );
      
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      setuser(response.data.user.username);
      setemail(response.data.user.email);

      toast.success("Successfully Logged In...", {
        position: "top-center",
      });
      toast("Rediracting To The Bank Linking...", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/LinkYourBank");
      }, 2000);
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border flex flex-col gap-5">
        <Msg
          Data={{
            Heading: "Log In",
            SubHeading: "Welcome back! Please enter your details.",
          }}
        />
        <div>
          <Label className="text-base mb-3">Username</Label>
          <Input
            type="text"
            placeholder="Enter Your Username"
            className="mt-1"
            name="username"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="text-base mb-3">Password</Label>
          <Input
            type="password"
            placeholder="Enter Your Password"
            className="mt-1"
            name="password"
            onChange={handleChange}
          />
        </div>
        <Button onClick={(e) => handleSubmit(e)}>Login</Button>
        <p className="text-center">
          Don't have an account?&nbsp;
          <Link to="/Signup" className="text-[#1c284f] font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
