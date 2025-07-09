import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 



const PageContainer = styled.div`
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  padding: 2px;
`;

const FormContainer = styled.form`
  padding: 20px;
  background: white
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border-top: 2px solid purple;
`;

const Title = styled.h2`
  color: purple;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: black;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 5px;
  background: white;
  color: #241f1fe0;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: purple;
    box-shadow: 0 0 10px purple50;
  }
`;

const GreenButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: purple;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 15px purple70;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 25px purple;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 15px;
`;

const Subtext = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #aaa;
  font-size: 0.9rem;

  a {
    color: purple;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;


export default function Register({ setToken }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      setToken(res.data.token);
      localStorage.setItem('token', res.data.token); 
      navigate('/dashboard'); 
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError('Registration failed. Please try again.'); 
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <PageContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Create Your Account</Title>
        <InputGroup>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <GreenButton type="submit">Create Account</GreenButton>

        <Subtext>
          Already have an account? <Link to="/login">Log In</Link>
        </Subtext>
      </FormContainer>
    </PageContainer>
  );
}
