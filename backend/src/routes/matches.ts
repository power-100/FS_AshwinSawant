import express from 'express';
import { ApiResponse } from '../types/api';

const router = express.Router();

router.get('/find', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Match finding not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

export default router;