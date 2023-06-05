import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
//import 'bootstrap/dist/css/bootstrap.css';
import '../styles/style.css';


function LoginNew() {
  const [values, setValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState([]);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.email === '' && err.password === '') {
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          if (res.data.errors) {
            setBackendError(res.data.errors);
          } else {
            setBackendError([]);
            
            if (res.data.status) {
              // Set user data in cookies
             // document.cookie = `user=${JSON.stringify(values)}`;
             localStorage.setItem('user', JSON.stringify(res.data));
              navigate('/todoPage');
            } else {
              alert('No record existed');
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-form'>
      <center> <h2 style={{color:'black'}}>Sign-In</h2></center>
        {backendError ? (
          backendError.map((e) => <p className='text-danger'>{e.msg}</p>)
        ) : (
          <span></span>
        )}
        <form action='' onSubmit={handleSubmit}>
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
            {errors.email && (
              <span className='text-danger'>{errors.email}</span>
            )}
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
            {errors.password && (
              <span className='text-danger'>{errors.password}</span>
            )}
          </div><br />
          <center><button type='submit' className='btn btn-success w-100 rounded-0'>
            Log in
          </button>
          <br/><br/>
          <Link
            to='/signup'
            className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'
          >
            Create Account
          </Link></center>
        </form>
      </div>
    </div>
  );
}

export default LoginNew;
