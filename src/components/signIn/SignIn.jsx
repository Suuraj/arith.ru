import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const scriptContainerRef = useRef(null);

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      try {
        const res = await axios.post(
          'https://arith-ru.onrender.com/signin',
          user,
        );
        login(res.data.username, res.data.token);
        if (/^[a-zA-Z]{3,15}$/.test(res.data.username)) {
          navigate('/profile');
        } else {
          navigate('/username');
        }
      } catch (err) {
        alert('Failed to sign in');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    script.setAttribute('data-telegram-login', 'arithrubot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '0');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    //script.setAttribute('data-request-access', 'write');

    if (scriptContainerRef.current) {
      scriptContainerRef.current.appendChild(script);
    }

    return () => {
      if (scriptContainerRef.current) {
        scriptContainerRef.current.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [login]);

  return (
    <main>
      <h2>Sign in</h2>
      <div ref={scriptContainerRef}></div>
    </main>
  );
};

export default SignIn;
