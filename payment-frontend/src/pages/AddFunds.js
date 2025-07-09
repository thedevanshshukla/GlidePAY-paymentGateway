import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus, FaQrcode } from 'react-icons/fa';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  background: white
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  border-top: 2px solid purple;
`;

const Title = styled.h2`
  color: purple;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  
`;

const BackLink = styled.div`
  display: flex;
  align-items: center;
  color: #aaa;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 1.3rem;
  
  &:hover {
    color: purple;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const OptionCard = styled.div`
  background: #222;
  padding: 25px;
  border-radius: 8px;
  border-left: 4px solid #444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    transform: translateX(10px);
    border-left-color: purple;
  }
`;

const OptionIcon = styled.div`
  font-size: 2.5rem;
  color: purple;
  margin-right: 20px;
`;

const OptionDetails = styled.div`
  h3 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    color: #fff;
  }
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #aaa;
  }
`;


export default function AddFunds() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <ContentWrapper>
        <BackLink onClick={() => navigate('/dashboard')}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          
        </BackLink>
        <Title>Add Funds</Title>
        <OptionsContainer>
          <OptionCard onClick={() => navigate('/request-by-form')}>
            <OptionIcon><FaUserPlus /></OptionIcon>
            <OptionDetails>
              <h3>Request from a User</h3>
              <p>Send a payment request to a specific person using their email.</p>
            </OptionDetails>
          </OptionCard>

          <OptionCard onClick={() => navigate('/request-by-qr')}>
            <OptionIcon><FaQrcode /></OptionIcon>
            <OptionDetails>
              <h3>Generate a Payment QR Code</h3>
              <p>Create a unique QR code for a specific amount that anyone can scan to pay you.</p>
            </OptionDetails>
          </OptionCard>
        </OptionsContainer>
      </ContentWrapper>
    </PageContainer>
  );
}
