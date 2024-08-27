import React, {useState} from 'react';
import {Label} from './ui/label';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';
import Msg from './Msg';
import {Button} from './ui/button';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState ({
    first_name: '',
    last_name: '',
    address: '',
    state: '',
    zip_code: '',
    username: '',
    email: '',
    password: '',
    date_of_birth: '',
  });
  const navigate = useNavigate ();

  const handleChange = e => {
    setFormData ({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    try {
      const response = await axios.post (
        'http://127.0.0.1:8000/api/signup/',
        formData
      );
      console.log ('User signed up:', response.data);
      navigate ('/Login');
    } catch (error) {
      console.error ('Signup error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center pt-20 pb-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg border flex flex-col gap-5">
        <Msg
          Data={{Heading: 'Sign Up', SubHeading: 'Please enter your details.'}}
        />
        <div className="flex gap-6">
          <div className="w-full">
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="ex: John"
              className="mt-2"
              name="first_name"
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="ex: Doe"
              className="mt-2"
              name="last_name"
              onChange={handleChange}
            />
          </div>
        </div>
        <Label>Address</Label>
        <Textarea
          placeholder="Enter The Address."
          name="address"
          onChange={handleChange}
        />
        <div className="flex gap-6">
          <div className="w-full">
            <Label>State</Label>
            <Input
              type="text"
              placeholder="ex: Gujarat"
              className="mt-2"
              name="state"
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <Label>Zip Code</Label>
            <Input
              type="number"
              placeholder="ex: 11101"
              className="mt-2"
              name="zip_code"
              onChange={handleChange}
            />
          </div>
        </div>
        <Label>Date of Birth</Label>
        <Input
          type="date"
          placeholder="ex: Gujarat"
          className="mt-2"
          name="date_of_birth"
          onChange={handleChange}
        />
        <Label>username</Label>
        <Input
          type="text"
          placeholder="Enter Your username"
          name="username"
          onChange={handleChange}
        />
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter Your Email"
          name="email"
          onChange={handleChange}
        />
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter Your Password"
          name="password"
          onChange={handleChange}
        />
        <Button onClick={e => handleSubmit (e)}>Sign Up</Button>
        <p className="text-center">
          Don't have an account?&nbsp;
          <Link to="/Login" className="text-[#1c284f] font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
