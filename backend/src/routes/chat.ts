import express from 'express';
import { ApiResponse } from '../types/api';

const router = express.Router();

router.get('/rooms', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Chat system not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

export default router;