  import React, { useState, useEffect } from 'react';
  import styled from 'styled-components';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { Html5QrcodeScanner } from 'html5-qrcode';

  // Component Styles
  const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: white;
    color: purple;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
  `;

  const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: none;
    color: purple;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    z-index: 10;
  `;

  const SendMoneyContainer = styled.div`
    position: relative;
    background: white
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 500px;
    color: #fff;
    border-left: 4px solid purple;
  `;

  const Title = styled.h1`
    text-align: center;
    color: purple;
    margin-bottom: 30px;
  `;

  const InputGroup = styled.div`
    margin-bottom: 20px;
  `;

  const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: black;
    font-weight: 500;
  `;

  const Input = styled.input`
    width: 100%;
    padding: 12px;
    background: white;
    border: 1px solid #444;
    border-radius: 5px;
    color: black;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: purple;
    }
  `;

  const Button = styled.button`
    width: 100%;
    padding: 15px;
    background: purple;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: white;
      color: purple;
      border: 1px solid purple;
    }
    
    &:disabled {
      background: #555;
      cursor: not-allowed;
    }
  `;

  const QRButton = styled(Button)`
    background: purple;
    border: 1px solid purple;
    color: white;
    margin-top: 15px;

    &:hover {
      background: white;
      color: purple;
      border: 1px solid purple;
    }
  `;

  const ErrorMessage = styled.p`
    color: #ff4d4d;
    text-align: center;
    margin-top: 15px;
  `;

  const SuccessMessage = styled.p`
    color: #39d353;
    text-align: center;
    margin-top: 15px;
  `;

  const ScannerOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const ScannerContainer = styled.div`
    width: 90%;
    max-width: 500px;
    background: white
    border-radius: 10px;
    overflow: hidden;
    padding: 20px;
  `;

  const ScannerTitle = styled.h3`
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  `;

  const CloseButton = styled.button`
    margin-top: 20px;
    padding: 12px 25px;
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  `;

  // Main Component
  export default function SendMoney() {
    // Component State
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    // QR Scanner Logic
    useEffect(() => {
      if (!showScanner) return;

      let scanner;

      const onScanSuccess = (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          const mail = data.email;
          const scannedAmount = data.amount;

          if (mail) {
            setRecipient(mail);
            setAmount(scannedAmount || '');
            setSuccess(`Recipient ${mail} found! Ready to send.`);
            setError('');
          } else {
            setError(`Invalid QR Format. Data: ${JSON.stringify(data)}`);
          }
        } catch (e) {
          setError(`Invalid QR. Found plain text: "${decodedText}"`);
        } finally {
          setShowScanner(false);
        }
      };

      const onScanFailure = (err) => {};

      const startScanner = () => {
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        scanner = new Html5QrcodeScanner('qr-reader', config, false);
        scanner.render(onScanSuccess, onScanFailure);
      };

      startScanner();

      return () => {
        if (scanner) {
          scanner.clear().catch(err => {
            console.error("Scanner cleanup failed.", err);
          });
        }
      };
    }, [showScanner]);

    // Form Submission
    const handleSend = async (e) => {
      e.preventDefault();
      if (!recipient || !amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid recipient and amount.');
        return;
      }
      setError('');
      setSuccess('');
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/transactions/send`,
          {
            toEmail: recipient, // This now matches your backend
            amount,
            message
          },
          config
        );
        setSuccess(response.data.message);
        setRecipient('');
        setAmount('');
        setMessage('');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while sending money.');
      }
    };

    // Component Rendering
    return (
      <PageContainer >
        <SendMoneyContainer>
          <BackButton onClick={() => navigate('/dashboard')}>
            &larr; 
          </BackButton>

          <Title>Send Money</Title>
          <form onSubmit={handleSend} style={{ padding: '37px'}}>
            <InputGroup>
              <Label>Recipient (User Email)</Label>
              <Input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                step="0.01"
              />
            </InputGroup>
            <InputGroup>
              <Label>Message (Optional)</Label>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., For dinner last night"
              />
            </InputGroup>
            <Button type="submit">Send Payment</Button>
          </form>

          <QRButton onClick={() => setShowScanner(true)}>
            Send with QR
          </QRButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </SendMoneyContainer>

        {showScanner && (
          <ScannerOverlay>
            <ScannerContainer>
              <ScannerTitle>Scan QR Code</ScannerTitle>
              <div id="qr-reader" />
            </ScannerContainer>
            <CloseButton onClick={() => setShowScanner(false)}>Cancel</CloseButton>
          </ScannerOverlay>
        )}
      </PageContainer>
    );
  }
