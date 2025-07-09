import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPaperPlane, FaPlusCircle, FaSignOutAlt, FaReceipt, FaBell } from 'react-icons/fa';


const DashboardPage = styled.div`
  min-height: 100vh;
  background: white;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: 600px) {
    padding: 15px 20px;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: purple;
  margin: 0;
  cursor: pointer;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationBell = styled.div`
  position: relative;
  color: #ccc;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    
    color: purple;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff4d4d;
  color: purple;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  border: 1px solid #1a1a1a;
`;

const RequestsPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 400px;
  background: white
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.5);
  border: 1px solid #333;
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
  color: purple;

  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
    color: purple;
  }

  @media (max-width: 600px) {
    position: fixed;
    top: 65px;
    right: 5vw;
    left: 5vw;
    width: 90vw;
    max-height: 70vh;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid purple;
  color: purple;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: purple;
    color: #1a1a1a;
  }
`;

const RequestItem = styled.div`
  padding: 15px 5px;
  border-bottom: 1px solid #2a2a2a;
  &:last-child { border-bottom: none; }
`;

const RequestInfo = styled.p`
  margin: 0 0 15px 0;
  line-height: 1.4;
  span {
    font-weight: bold;
    color: purple;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  flex-grow: 1;
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ApproveButton = styled(ActionButton)`
  background-color: purple;
  color: #1a1a1a;
`;

const DeclineButton = styled(ActionButton)`
  background-color: #555;
  color: #ccc;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.5rem;
  text-align: center;
`;

const WelcomeHeader = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  span {
    color: purple;
  }
`;

const DashboardMessage = styled.div`
  background: white;
  border-left: 4px solid purple;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 40px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  h3 { margin-top: 0;  color: purple;; font-weight: 600; }
  p { margin-bottom: 0; color: black; line-height: 1.6; }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: white
  padding: 25px;
  border-radius: 10px;
  border-left: 4px solid purple;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: purple;
`;

const BalanceCard = styled(Card)`
  h3 { font-size: 1rem; color: #ccc; margin: 0 0 10px 0; text-transform: uppercase; }
  p { font-size: clamp(1.7rem, 7vw, 2.3rem); font-weight: bold; color: #fff; margin: 0; word-break: break-all; }
`;

const ActionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  border-left: 4px solid #444;
  &:hover { transform: translateY(-5px); background: purple; border-left-color: purple;color: white; }
  p { margin-top: 15px; font-size: 1.1rem; font-weight: 600; }
  color: purple;
`;

const ActionIcon = styled.div`
  font-size: 2.5rem;
  color: purple;
  &:hover { transform: translateY(-5px); background: purple; border-left-color: purple;color: white; }
`;

const TransactionsSection = styled.section`
  background: white
  padding: 25px;
  border-radius: 10px;
  color: purple;
  h3 { font-size: 1.5rem; margin: 0 0 20px 0; border-bottom: 1px solid #333; padding-bottom: 15px; }
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: purple;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5px;
  border-bottom: 1px solid #2a2a2a;
  &:last-child { border-bottom: none; }
  color: purple;
`;

const TransactionDetails = styled.div`
  p { margin: 0; font-weight: 500; }
  span { font-size: 0.85rem; color: #aaa; }
  
`;

// --- FIX #1: The component's color now depends on the sign of the amount ---
const TransactionAmount = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${props => (props.amount < 0 ? '#ff4d4d' : '#39d353')};
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px 40px;
  color: #555;
  border-top: 1px solid #222;
  margin-top: auto;
`;

export default function Dashboard({ setToken }) {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  }, [setToken, navigate]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [userRes, transactionsRes, pendingRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/recent`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/pending`, config)
      ]);
      setUserData(userRes.data);
      setTransactions(transactionsRes.data.filter(tx => tx.status !== 'pending')); 
      setPendingRequests(pendingRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        setError('Failed to load dashboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate, fetchData]);

  const handleRequestAction = async (requestId, action) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/request/${requestId}/${action}`, {}, config);
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      fetchData();
    } catch (err) {
      alert(`Failed to ${action} request. Please try again.`);
      console.error(`Error ${action}ing request:`, err);
    }
  };
  
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  if (loading) return <DashboardPage><MessageContainer>Loading...</MessageContainer></DashboardPage>;
  if (error) return <DashboardPage><MessageContainer>{error}</MessageContainer></DashboardPage>;

  return (
    <DashboardPage>
      <Header>
        <Logo onClick={() => navigate('/dashboard')}>GLiDEPay</Logo>
        <HeaderActions>
          <NotificationContainer>
            <NotificationBell onClick={() => setShowRequestsPanel(prev => !prev)}>
              <FaBell />
              {pendingRequests.length > 0 && <Badge>{pendingRequests.length}</Badge>}
            </NotificationBell>
            {showRequestsPanel && pendingRequests.length > 0 && (
              <RequestsPanel>
                <h4>Pending Money Requests</h4>
                {pendingRequests.map(req => (
                  <RequestItem key={req._id}>
                    <RequestInfo>
                      <span>{req.to.firstName} {req.to.lastName}</span> is requesting <span>{formatCurrency(req.amount)}</span>.
                    </RequestInfo>
                    <ActionButtons>
                      <ApproveButton onClick={() => handleRequestAction(req._id, 'approve')}>Approve</ApproveButton>
                      <DeclineButton onClick={() => handleRequestAction(req._id, 'decline')}>Decline</DeclineButton>
                    </ActionButtons>
                  </RequestItem>
                ))}
              </RequestsPanel>
            )}
          </NotificationContainer>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </LogoutButton>
        </HeaderActions>
      </Header>
      
      <MainContent>
        <WelcomeHeader style={{'color': 'purple'}}>Welcome back, <span>{userData?.firstName}</span>!</WelcomeHeader>
        
        <DashboardMessage>
            <h3>Your Financial Command Center</h3>
            <p>This is your central hub for managing funds, viewing recent activity, and handling payment requests.</p>
        </DashboardMessage>

        <CardsContainer>
          <BalanceCard style={{'padding': '23px'}}>
            <h3>Current Balance</h3>
            <p style={{'color': 'purple'}}>{formatCurrency(userData?.balance)}</p>
          </BalanceCard>
          <ActionCard style={{'padding': '23px'}} onClick={() => navigate('/send-money')}>
            <ActionIcon><FaPaperPlane /></ActionIcon>
            <p>Send Money</p>
          </ActionCard>
          <ActionCard style={{'padding': '23px'}} onClick={() => navigate('/add-funds')}>
            <ActionIcon><FaPlusCircle /></ActionIcon>
            <p>Add Funds</p>
          </ActionCard>
        </CardsContainer>
        
        <TransactionsSection>
          <h3><FaReceipt style={{ marginRight: '10px' }} />Recent Activity</h3>
          {transactions.length > 0 ? (
            <TransactionList>
              {transactions.map(tx => (
                <TransactionItem key={tx.id}>
                  <TransactionDetails>
                    <p>{tx.description}</p>
                    <span>{new Date(tx.date).toLocaleString()}</span>
                  </TransactionDetails>
                  {/* --- FIX #2: The amount and sign are now derived directly from the amount's value --- */}
                  <TransactionAmount amount={tx.amount}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionList>
          ) : (
            <p>No recent transactions found.</p>
          )}
        </TransactionsSection>
      </MainContent>

      <Footer>
        Made by Devansh Shukla
      </Footer>
    </DashboardPage>
  );
}
