import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../utils/Input';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';

const Username = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [isTaken, setIsTaken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidFormat = /^[a-zA-Z]{3,15}$/.test(username);
  const isButtonDisabled = !isValidFormat || isSubmitting;
  const isError = isTaken || (username.length > 0 && !isValidFormat);

  const handleSubmit = async () => {
    if (!isValidFormat) return;
    setIsSubmitting(true);
    setIsTaken(false);

    await axios
      .post(
        'https://arith-ru.onrender.com/username',
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      )
      .then((res) => {
        login(res.data.username, res.data.token);
        navigate('/profile');
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setIsTaken(true);
        } else {
          alert('Something went wrong');
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <main>
      <h2>Setup username</h2>

      <Input
        value={username}
        setValue={(val) => {
          setUsername(val);
          setIsTaken(false);
        }}
        className={isError ? 'errorInput' : null}
        type="text"
        placeholder="Username"
        required
      />
      <span className={`errorAlert ${isError ? 'visible' : 'hidden'}`}>
        {isTaken && 'Username already taken'}
        {'\u200B'}
        {username.length > 0 &&
          !isValidFormat &&
          'Latin alphabet only (at least 3 letters)'}
      </span>

      <div>
        <button onClick={!isButtonDisabled ? handleSubmit : null}>Save</button>
        <br />
        <br />
        <a
          href=""
          onClick={() => {
            logout();
            navigate('/signin');
          }}
        >
          Log out
        </a>
      </div>
    </main>
  );
};

export default Username;
