import React, {useState} from 'react';
import {Label} from './ui/label';
import {Input} from './ui/input';
import {Button} from './ui/button';
import {Link} from 'react-router-dom';
import Msg from './Msg';

const Login = () => {
  const [email, setemail] = useState ('');
  const [password, setpassword] = useState ('');
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border flex flex-col gap-5">
        <Msg
          Data={{
            Heading: 'Log In',
            SubHeading: 'Welcome back! Please enter your details.',
          }}
        />
        <div>
          <Label className="text-base mb-3">Email</Label>
          <Input
            type="email"
            placeholder="Enter Your Email"
            className="mt-1"
            value={email}
            onChange={e => setemail (e.target.value)}
          />
        </div>
        <div>
          <Label className="text-base mb-3">Password</Label>
          <Input
            type="password"
            placeholder="Enter Your Password"
            className="mt-1"
            value={password}
            onChange={e => setpassword (e.target.value)}
          />
        </div>
        <Button>Login</Button>
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
