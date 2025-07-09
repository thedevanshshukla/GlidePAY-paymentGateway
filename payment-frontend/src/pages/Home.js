import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';



const floating = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;



const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  box-sizing: border-box; 
  overflow-x: hidden; 
  position: relative;
  width: 100%;
`;

const AppLogo = styled.h1`
  font-size: clamp(2.5rem, 8vw, 3.5rem); 
  font-weight: 700;
  color: purple;
  text-shadow: 0 0 15px rgba(50, 205, 50, 0.6);
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-align: center;
`;

const FloatingCard = styled.div`
  width: 90vw; 
  max-width: 350px; 
  height: auto; 
  min-height: 220px;
  background: linear-gradient(45deg, #222, #444);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${floating} 4s ease-in-out infinite;
  border-top: 2px solid silver;
  border-right: 2px solid silver;
  box-sizing: border-box;
`;

const CardChip = styled.div`
  width: 50px;
  height: 40px;
  background: #ffdf00;
  border-radius: 5px;
`;

const CardNumber = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(1.1rem, 5vw, 1.5rem);
  letter-spacing: 3px;
  color: #eee;
  margin: 0;
  word-wrap: break-word; 
`;

const CardHolder = styled.p`
  font-size: clamp(0.8rem, 3vw, 0.9rem);
  color: #ccc;
  text-transform: uppercase;
  word-wrap: break-word; 
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 7vw, 2.5rem);
  margin-top: 40px;
  margin-bottom: 10px;
  color: #fff;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 4vw, 1.1rem);
  color: #aaa;
  margin-bottom: 30px;
  text-align: center;
  max-width: 90%;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 15px;
  justify-content: center;
  width: 100%;
  max-width: 500px;
`;

const GreenButton = styled.button`
  padding: 12px 24px;
  font-size: clamp(0.9rem, 4vw, 1rem);
  font-weight: bold;
  color: #fff;
  background-color: purple;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-grow: 1; /* Allow buttons to grow */
  min-width: 150px; /* Give a minimum width */

  &:hover {
    transform: scale(1.05);
  }
`;

const FooterText = styled.p`
  position: relative; /* Changed from absolute to keep in flow */
  font-size: clamp(1rem, 4vw, 1.2rem);
  color: #444;
  margin-top: 50px; /* Add space above the footer */
  text-align: center;
  width: 100%;
`;


// The Main Component 
export default function Home() {
  const navigate = useNavigate();

  const [cardDetails, setCardDetails] = useState({
    name: 'DEVANSH SHUKLA',
    number: 'XXXX XXXX XXXX 3737',
  });

  useEffect(() => {
    const sampleNames = ['DEVANSH SHUKLA', 'JANE DOE', 'ALEX RAY', 'CHRIS CODE'];
    let nameIndex = 0;

    const intervalId = setInterval(() => {
      nameIndex = (nameIndex + 1) % sampleNames.length;
      const newNumber = `XXXX XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`;
      
      setCardDetails({
        name: sampleNames[nameIndex],
        number: newNumber,
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <HomeContainer>
      <AppLogo>GLiDEPay</AppLogo>

      <FloatingCard>
        <CardChip />
        <div>
          <CardNumber>{cardDetails.number}</CardNumber>
          <CardHolder>{cardDetails.name}</CardHolder>
        </div>
      </FloatingCard>

      <Title>Secure Payments, Reimagined.</Title>
      <Subtitle>Join the future of finance. Fast, secure, and stylish.</Subtitle>
      
      <ButtonContainer>
        <GreenButton onClick={() => navigate('/login')}>Login</GreenButton>
        <GreenButton onClick={() => navigate('/register')} style={{ background: '#222', border: '2px solid purple' }}>
          Create Account
        </GreenButton>
      </ButtonContainer>

      <FooterText><b>Made by DEVANSH SHUKLA</b></FooterText>
    </HomeContainer>
  );
}

