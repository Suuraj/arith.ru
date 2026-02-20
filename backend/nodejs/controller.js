const User = require('./user');
const Result = require('./result');
const jwt = require('jsonwebtoken');
const secrets = require('/etc/secrets/secrets');
const crypto = require('crypto');

class controller {
  async sigin(req, res) {
    try {
      const { hash, ...data } = req.body;
      if (!hash) {
        return res.status(400).json({ message: 'No hash provided' });
      }

      const secretKey = crypto
        .createHash('sha256')
        .update(secrets.botToken)
        .digest();

      const dataCheckString = Object.keys(data)
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join('\n');

      const hmac = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      if (hmac !== hash) {
        return res.status(401).json({ message: 'Data is NOT from Telegram' });
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - data.auth_date > 86400) {
        return res.status(401).json({ message: 'Data is outdated' });
      }

      const telegramId = data.id;
      let user = await User.findOne({ telegramId });
      if (!user) {
        user = new User({ telegramId, username: telegramId });
        await user.save();
      }

      const token = jwt.sign({ username: user.username }, secrets.jwtSecret, {
        expiresIn: '3d',
      });

      return res.json({
        token,
        username: user.username,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }

  async username(req, res) {
    try {
      const { username: newUsername } = req.body;
      const oldUsername = req.username;

      if (!/^[a-zA-Z]{3,15}$/.test(newUsername)) {
        return res.status(400).json({ message: 'Invalid username format' });
      }

      const existing = await User.findOne({ username: newUsername }).collation({
        locale: 'en',
        strength: 2,
      });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const user = await User.findOneAndUpdate(
        { username: oldUsername },
        { username: newUsername },
        { returnDocument: 'after' },
      );

      if (!user) return res.status(404).json({ message: 'User not found' });

      await Result.updateMany(
        { username: oldUsername },
        { username: newUsername },
      );

      const token = jwt.sign({ username: user.username }, secrets.jwtSecret, {
        expiresIn: '3d',
      });

      return res.json({ token, username: user.username });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async auth(req, res) {
    try {
      const token = jwt.sign({ username: req.username }, secrets.jwtSecret, {
        expiresIn: '3d',
      });

      return res.json({
        token,
        username: req.username,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }

  async get(req, res) {
    try {
      const results = await Result.find({
        username: req.username,
        questionCount: +req.query.questionCount,
      }).select('result date -_id');

      return res.json(results);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }

  async set(req, res) {
    try {
      const username = req.username;
      const date = req.body.date;
      const result = req.body.result;
      const questionCount = req.body.questionCount;

      await new Result({
        username,
        questionCount,
        result,
        date,
      }).save();

      return res;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }

  async leaders(req, res) {
    try {
      const questionCount = +req.query.questionCount;
      const leaders = await Result.aggregate([
        {
          $match: {
            questionCount: questionCount,
          },
        },
        {
          $group: {
            _id: '$username',
            result: {
              $min: {
                result: '$result',
                date: '$date',
                username: '$username',
              },
            },
          },
        },
        {
          $sort: {
            result: 1,
            date: 1,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$result',
          },
        },
      ]);

      return res.json(leaders);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }
}

module.exports = new controller();
