import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user;
    return handler(req, res);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default authMiddleware;
