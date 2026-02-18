import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Input from '../../utils/Input';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';

const Username = () => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username, login, isAuth } = useAuth();

  if (username) return <Navigate to="/" />;
  if (!isAuth) return <Navigate to="/signin" />;

  const isValidFormat = /^[a-zA-Z]{3,15}$/.test(newUsername);
  const isButtonDisabled = !isValidFormat || isSubmitting;

  const handleSubmit = async () => {
    if (!isValidFormat) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://arith-ru.onrender.com/username',
        { username: newUsername },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      login(res.data.username, res.data.token);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('taken');
      } else {
        alert('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h2>Setup username</h2>

      <Input
        value={newUsername}
        setValue={(val) => {
          setNewUsername(val);
          setError(null);
        }}
        type="text"
        placeholder="Username"
        required
      />
      {error === 'taken' && (
        <span className="errorAlert">Username already taken</span>
      )}
      {newUsername.length > 0 && !isValidFormat && (
        <span className="errorAlert">
          Latin alphabet only (at least 3 letters)
        </span>
      )}

      <div>
        <span
          className={!isButtonDisabled ? 'button' : 'hidden'}
          onClick={!isButtonDisabled ? handleSubmit : null}
        >
          Save
        </span>
      </div>
    </main>
  );
};

export default Username;
