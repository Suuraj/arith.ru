import axios from 'axios';

export const setResult = async (date, result, questionCount) => {
  await axios
    .post(
      'https://arith-ru.onrender.com/set',
      {
        date,
        result,
        questionCount,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      },
    )
    .catch((err) => {
      //console.log(err.response.data);
    });
};

export const getResults = async (questionCount) => {
  await axios
    .get('https://arith-ru.onrender.com/get', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { questionCount },
    })
    .then((res) => {
      localStorage.setItem('results' + questionCount, JSON.stringify(res.data));
    })
    .catch((err) => {
      //console.log(err.response.data);
    });
};

export const getLeaders = async (questionCount) => {
  await axios
    .get('https://arith-ru.onrender.com/leaders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { questionCount },
    })
    .then((res) => {
      localStorage.setItem(
        'leaderboard' + questionCount,
        JSON.stringify({ leaders: res.data, date: new Date() }),
      );
    })
    .catch((err) => {
      //console.log(err.response.data);
    });
};
