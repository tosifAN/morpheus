import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { isAuthenticated } from '../authentication/login_util';

const Home = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  }, [navigate]); 

  return null; 
};

export default Home;
