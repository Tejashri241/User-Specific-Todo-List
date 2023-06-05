import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import '../styles/todostyles.css';


function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.name === '' && err.email === '' && err.password === '') {
      axios
        .post('http://localhost:8081/signup', values)
        .then((res) => {
          // Store user data in cookies
          document.cookie = `user=${JSON.stringify(res.data)}`;

          navigate('/');
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-form'>
       <center> <h2 style={{color:'black'}}>Sign-Up</h2></center>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='l1'>
              <strong>Name</strong>
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input
              type='text'
              placeholder='Enter Name'
              name='name'
              onChange={handleInput}
              className='form-control rounded-0'
            />
            {errors.name && <span className='text-danger'> {errors.name}</span>}
          </div><br />
          <div className='mb-3'>
            <label htmlFor='email' className='l1'>
              <strong>Email</strong>
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type='email'
              placeholder='Enter Email'
              name='email'
              onChange={handleInput}
              className='form-control rounded-0'
            />
            {errors.email && <span className='text-danger'> {errors.email}</span>}
          </div><br />
          <div className='mb-3'>
            <label htmlFor='password' className='l1'>
              <strong>Password</strong>
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type='password'
              placeholder='Enter Password'
              name='password'
              onChange={handleInput}
              className='form-control rounded-0'
            />
            {errors.password && <span className='text-danger'> {errors.password}</span>}
          </div><br />
          <center>
          <button type='submit' style={{textAlign:'center'}}>
            Sign up
          </button>
          <p></p>
          <Link to='/' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
            Login
          </Link></center>
        </form>
      </div>
    </div>
  );
}

export default Signup;
