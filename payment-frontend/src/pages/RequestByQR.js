import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';

// Component Styles
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

const FormContainer = styled.div`
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
  margin-bottom: 20px;
  font-size: 2rem;
  padding: 15px;
`;

const Description = styled.p`
  text-align: center;
  color: black;
  line-height: 1.6;
  margin-bottom: 30px;
  
`;

const BackLink = styled.div`
  display: flex;
  align-items: center;
  color: black;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 1.3rem;
  
  &:hover {
    color: purple;
  }
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #222;
  border-radius: 10px;
`;

const DownloadButton = styled.button`
  background: none;
  border: 1px solid purple;
  color: purple;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: purple;
    color: #1a1a1a;
  }
`;

// Main Component
export default function RequestByQR() {
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, config);
        setCurrentUserEmail(data.email);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserEmail();
  }, []);

  
  useEffect(() => {
    if (currentUserEmail) {
      const payload = {
        email: currentUserEmail,
      };
      setQrValue(JSON.stringify(payload));
    }
  }, [currentUserEmail]);

  // Handle QR Code Download
  const handleDownload = () => {
    const canvas = document.getElementById('request-qr-code');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `gitpay-my-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <FormContainer>
        <BackLink onClick={() => navigate('/dashboard')}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          
        </BackLink>
        <Title>My QR Code</Title>
        <Description>
          Let others scan this code to send you money. They will be prompted to enter the amount.
        </Description>
        
        {qrValue ? (
          <QRContainer>
            <QRCodeCanvas
              id="request-qr-code"
              value={qrValue}
              size={256}
              level={'H'}
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#0d0d0d"
            />
            <DownloadButton onClick={handleDownload}>
              <FaDownload /> Download QR
            </DownloadButton>
          </QRContainer>
        ) : (
          <Description>Generating your personal QR code...</Description>
        )}
      </FormContainer>
    </PageContainer>
  );
}
