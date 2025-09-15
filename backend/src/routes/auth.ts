import express from 'express';
import { ApiResponse } from '../types/api';

const router = express.Router();

// POST /auth/register
router.post('/register', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Authentication system not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

// POST /auth/login
router.post('/login', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Authentication system not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

// POST /auth/verify-email
router.post('/verify-email', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Email verification not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

export default router;