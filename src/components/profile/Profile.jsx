import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getResults } from '../../actions/result';
import Input from '../../utils/Input';
import styles from './Profile.module.css';
import { useAuth } from '../../context/AuthProvider';

const Profile = () => {
  const { username, logout } = useAuth();
  const [questionCount, setQuestionCount] = useState(
    localStorage.getItem('questionCount') ?? 50,
  );
  const results = JSON.parse(localStorage.getItem('results' + questionCount));

  const formatDate = (tickItem) => {
    if (tickItem === 'auto') {
      return null;
    }

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat('default', options).format(
      new Date(tickItem),
    );
  };

  const handleInput = (e) => {
    let val = e.target.value;

    val = val < 1 ? 1 : val;
    val = val > 100 ? 100 : val;

    localStorage.setItem('questionCount', val);
  };

  useEffect(() => {
    if (
      !localStorage.getItem('results' + questionCount) ||
      localStorage.getItem('results' + questionCount) == '[]'
    ) {
      getResults(questionCount);
    }
  });

  return (
    <main id={styles.main}>
      <h2>{username}</h2>
      <label htmlFor="count">
        <h3>Questions:</h3>
      </label>
      <Input
        type="number"
        name="count"
        value={questionCount}
        setValue={setQuestionCount}
        onInput={handleInput}
        min="1"
        max="100"
      />
      <ResponsiveContainer height={400}>
        <LineChart
          data={results}
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatDate} dy={15} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip
            itemStyle={{
              color: 'black',
              backgroundColor: 'white',
            }}
            labelFormatter={formatDate}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          />
          <Line dataKey="result" />
        </LineChart>
      </ResponsiveContainer>
      <span className="button" onClick={logout}>
        Log out
      </span>
    </main>
  );
};

export default Profile;
