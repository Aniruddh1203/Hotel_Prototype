const { sendLoginAlert } = require('../services/emailService');

/**
 * Express Controller: Handle User Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Authenticate User (Mock DB / Service call)
    // Replace with your actual user authentication / password verification logic
    const mockUser = {
      id: 'usr_987654',
      name: 'John Doe',
      email: email,
    };

    // Example password check fallback:
    if (password !== 'password123' && password !== 'admin') {
      // Return 401 for bad credentials
      // return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Generate Auth Token / Session
    const mockToken = 'jwt_token_sample_abc123xyz';

    // 4. Extract Client Session Context (IP, User Agent, Timestamp)
    const loginContext = {
      userName: mockUser.name,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Browser/Device',
      location: 'New York, USA', // Optional: populated via GeoIP lookup if available
    };

    // 5. ASYNCHRONOUS (NON-BLOCKING) EMAIL DISPATCH
    // Do NOT 'await' this promise in the request-response loop!
    // Trigger the email in background so the user receives an instantaneous HTTP response.
    sendLoginAlert(mockUser.email, loginContext).catch((err) => {
      console.error('Background login alert dispatch error:', err);
    });

    // 6. Respond immediately to the client
    return res.status(200).json({
      message: 'Login successful',
      token: mockToken,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    });
  } catch (error) {
    console.error('Error during login execution:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

module.exports = {
  login,
};
