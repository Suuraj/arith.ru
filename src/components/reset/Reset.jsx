import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { reset } from '../../actions/user';
import Input from '../../utils/Input';

const Reset = () => {
  const [email, setEmail] = useState('');

  return (
    <main>
      <h2>Reset password</h2>

      <Input
        value={email}
        setValue={setEmail}
        type="email"
        placeholder="Email"
      />
      <span className="errorAlert hidden">Email not found</span>

      <span className="button" onClick={() => reset(email)}>
        Reset
      </span>

      <div className="links">
        <NavLink to="/signin">Sign in</NavLink>
      </div>
      <div className="links">
        <NavLink to="/signup">Sign up</NavLink>
      </div>
    </main>
  );
};

export default Reset;
