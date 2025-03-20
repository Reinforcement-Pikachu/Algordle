//routes
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { evaluateSolution } = require('../services/parSystem')

const router = express.Router();


router.get('/auth/session', (req, res) => {
    req.session.testValue = 'Hello, session!';
    console.log('Session Data:', req.session);
    res.json(req.session);
  });

router.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username };
    res.json({ user: req.session.user });
  } catch (err) {
    const errorObj = {
      log: `/auth/login: ERROR: ${err.message}`,
      message: {
        err: '/auth/login: ERROR: Failed to login',
      },
    };
    return next(errorObj);
  }
});

router.get('/auth/session', (req, res, next) => {
  try {
    console.log('Checking session:', req.session);
    // If the user has a session, return their data
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user, isAuthenticated: true });
      }
  
      // If the user doesn't have a session, indicate they're not authenticated
      return res.json({ user: null, isAuthenticated: false });
  } catch (err) {
    const errorObj = {
      log: `/auth/session: ERROR: ${err.message}`,
      message: {
        err: '/auth/session: ERROR: Failed to authenticate',
      },
    };
    return next(errorObj);
  }
});

router.post('/auth/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (userResult.rows.length > 0) {
      return res.status(401).json({ error: 'User Already Exists' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const newResult = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    const newUser = newResult.rows[0];

    // Store user session (if using express-session)
    req.session.user = { id: newUser.id, username: newUser.username };

    res.json({ user: req.session.user });
  } catch (err) {
    const errorObj = {
      log: `/auth/signup: ERROR: ${err.message}`,
      message: {
        err: '/auth/signup: ERROR: Failed to sign up',
      },
    };
    return next(errorObj);
  }
});

router.post('/auth/logout', (req, res, next) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ error: "Failed to logout" });
        }
        res.clearCookie("connect.sid"); // Default session cookie name
        res.json({ message: "Logged out" });
      });
    } catch (err) {
      const errorObj = {
        log: `/auth/logout: ERROR: ${err.message}`,
        message: {
          err: '/auth/logout: ERROR: Failed to logout',
        },
      };
      return next(errorObj);
    }
});
  

//par system route
router.post('./evaluate', async (req, res) => {
  const { challengeName, solution } = req.body;
  
  if (!challengeName || !solution) {
    return res.status(400).json({ error: 'Missing the needed fields' });
  }
  
  const evaluate = await evaluateSolution(challengeName, solution);
  res.json(evaluate);

})

// router.get('/challenges', async (req, res, next) => {
//   try {
//     const result = await db.query('SELECT id, name, code, par FROM algorithms');

//     const challenges = result.rows.map(challenge => ({
//       id: challenge.id,
//       name: challenge.name,
//       function_definition: challenge.code.signature,
//       par_score: challenge.par
//     }));
//     return res.status(200).json(challenges);
//   } catch (err) {
//     const errorObj = {
//       log: `/challenges: ERROR: ${err.message}`,
//       message: {err: '/challenges: ERROR: Failed to fetch challenges'},
//     };
//     return next(errorObj);
//   }
// })
router.get('/challenges', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, code->>\'signature\' AS function_signature, par FROM algorithms');
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    return next({
      log: `/challenges: ERROR: ${err.message}`,
      message: { err: '/challenges: ERROR: Failed to fetch challenges' },
    });
  }
});


router.use((req, res) => res.sendStatus(404));

module.exports = router; 

