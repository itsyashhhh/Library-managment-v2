// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'user@123' && password === 'user@123') {
      navigate('/user');
      alert("Logged in as Admin!");
    } else {
      navigate('/library');
    }
  };

  return (
    <div className='login-box'>
    <div className='login-container'>
      <h2 className='login-header'>Login as user or Admin</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='form-group'>
          <label htmlFor="username" className='form-label'>UserID:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className='form-input' />
        </div>
        <div className='form-group'>
          <label htmlFor="password" className='form-label'>Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='form-input' />
        </div>
        <button type="submit" className='login-button'>Login</button>
      </form>
    </div>
    </div>
  );
}

export default Login;
