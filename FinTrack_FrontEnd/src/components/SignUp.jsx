import React, {useState} from 'react';
import {Label} from './ui/label';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';
import Msg from './Msg';
import {Button} from './ui/button';
import {Link} from 'react-router-dom';

const SignUp = () => {
  const [fname, setfname] = useState ('');
  const [lname, setlname] = useState ('');
  const [address, setaddress] = useState ('');
  const [State, setState] = useState ('');
  const [zipcode, setzipcode] = useState ('');
  const [dob, setdob] = useState ('');
  const [email, setemail] = useState ('');
  const [password, setpassword] = useState ('');
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
              value={fname}
              onChange={e => setfname (e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="ex: Doe"
              className="mt-2"
              value={lname}
              onChange={e => setlname (e.target.value)}
            />
          </div>
        </div>
        <Label>Address</Label>
        <Textarea
          placeholder="Enter The Address."
          value={address}
          onChange={e => setaddress (e.target.value)}
        />
        <div className="flex gap-6">
          <div className="w-full">
            <Label>State</Label>
            <Input
              type="text"
              placeholder="ex: Gujarat"
              className="mt-2"
              value={State}
              onChange={e => setState (e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label>Zip Code</Label>
            <Input
              type="number"
              placeholder="ex: 11101"
              className="mt-2"
              value={zipcode}
              onChange={e => setzipcode (e.target.value)}
            />
          </div>
        </div>
        <Label>Date of Birth</Label>
        <Input
          type="date"
          placeholder="ex: Gujarat"
          className="mt-2"
          value={dob}
          onChange={e => setdob (e.target.value)}
        />
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={e => setemail (e.target.value)}
        />
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={e => setpassword (e.target.value)}
        />
        <Button>Sign Up</Button>
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
