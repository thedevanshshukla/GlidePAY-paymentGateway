import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; 
import { FaArrowLeft, FaDownload } from 'react-icons/fa';


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0d0d0d;
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
  margin-bottom: 30px;
  font-size: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 5px;
  background: #222;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: purple;
    box-shadow: 0 0 10px purple50;
  }
`;

const BackLink = styled.div`
  display: flex;
  align-items: center;
  color: #aaa;
  cursor: pointer;
  margin-bottom: 30px;
  font-size: 0.9rem;
  
  &:hover {
    color: purple;
  }
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
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

export default function RequestMoney() {
  const [amount, setAmount] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
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
    if (amount > 0 && currentUserEmail) {
      const requestData = {
        recipientEmail: currentUserEmail,
        amount: Number(amount)
      };
      setQrValue(JSON.stringify(requestData));
    } else {
      setQrValue('');
    }
  }, [amount, currentUserEmail]);

  const handleDownload = () => {
    const canvas = document.getElementById('request-qr-code');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `payapp-request-${amount}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <FormContainer>
        <BackLink onClick={() => navigate('/dashboard')}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back to Dashboard
        </BackLink>
        <Title>Request Money</Title>
        <InputGroup>
          <Label htmlFor="amount">Amount to Request (USD)</Label>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            min="0.01"
            step="0.01"
          />
        </InputGroup>

        {qrValue && (
          <QRContainer>
            {/* FIX 2: Use the QRCodeCanvas component */}
            <QRCodeCanvas
              id="request-qr-code"
              value={qrValue}
              size={200}
              level={'H'}
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#0d0d0d"
            />
            <DownloadButton onClick={handleDownload}>
              <FaDownload /> Download QR
            </DownloadButton>
          </QRContainer>
        )}
      </FormContainer>
    </PageContainer>
  );
}
