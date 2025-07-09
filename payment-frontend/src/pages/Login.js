import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// STYLED COMPONENTS

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background:white;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  
`;

const FormContainer = styled.form`
  background: white
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border-top: 2px solid purple;
  box-sizing: border-box;
  position: relative; 
  color: black;
  @media (max-width: 480px) {
    padding: 30px 25px;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: #aaa; 
  transition: color 0.3s ease;

  &:hover {
    color: purple; 
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: currentColor; 
    stroke-width: 2;
  }
`;

const Title = styled.h2`
  color: purple;
  text-align: center;
  margin-bottom: 30px;
  font-size: clamp(1.8rem, 6vw, 2.2rem);
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-size: clamp(0.85rem, 3vw, 0.9rem);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 5px;
  background: white;
  color: black;
  font-size: clamp(0.9rem, 4vw, 1rem);
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
  font-size: clamp(0.9rem, 4vw, 1rem);
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


//  The Main Login Component 
export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
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
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <PageContainer>
      <FormContainer onSubmit={handleSubmit} style={{'padding': '28px'}}>
        {/* --- ADDED: The back button is placed here --- */}
        <BackButton to="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </BackButton>

        <Title>Welcome Back</Title>
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
            placeholder="••••••••"
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <GreenButton type="submit">Login</GreenButton>
        <Subtext>
          Don't have an account? <Link to="/register">Create one</Link>
        </Subtext>
      </FormContainer>
    </PageContainer>
  );
}
