import React, { useEffect, useState } from 'react';
import { getLeaders } from '../../actions/result';
import styles from './Leaderboard.module.css';
import { useAuth } from '../../context/AuthProvider';

const Leader = (props) => {
  const { username } = useAuth();

  if (!props.leaders) {
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

  return props.leaders.map((r) => (
    <tr className={r.username == username ? styles.currentUser : null}>
      <td>{r.username}</td>
      <td>
        {new Intl.DateTimeFormat('default', options).format(new Date(r.date))}
      </td>
      <td>{r.result}</td>
    </tr>
  ));
};

const Leaderboard = () => {
  const [questionCount, setQuestionCount] = useState(
    localStorage.getItem('questionCount') ?? 50,
  );
  const leaderboard =
    JSON.parse(localStorage.getItem('leaderboard' + questionCount)) ?? [];

  const handleClick = (count) => {
    if (count > 0 && count < 101) {
      setQuestionCount(count);
    }
  };

  useEffect(() => {
    if (
      leaderboard.length < 1 ||
      new Date() - new Date(leaderboard.date) > 5 * 60 * 1000
    ) {
      getLeaders(questionCount);
    }
  });

  return (
    <main>
      <table id={styles.leaderboard}>
        <caption>
          <h2>Leaderboard</h2>
          <h3>Questions: {questionCount}</h3>
          <span
            className="button"
            onClick={() => handleClick(+questionCount - 1)}
          >
            Prev
          </span>
          |
          <span
            className="button"
            onClick={() => handleClick(+questionCount + 1)}
          >
            Next
          </span>
        </caption>
        <thead>
          <tr>
            <th>Username</th>
            <th>Date</th>
            <th>Result (sec)</th>
          </tr>
        </thead>
        <tbody>
          <Leader leaders={leaderboard.leaders} />
        </tbody>
      </table>
    </main>
  );
};

export default Leaderboard;
