import express from 'express';
import { ApiResponse } from '../types/api';

const router = express.Router();

router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Route management not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

router.get('/my-routes', (req, res) => {
  res.status(501).json({
    success: false,
    error: {
      message: 'Route management not yet implemented',
      code: 'NOT_IMPLEMENTED'
    }
  } as ApiResponse<null>);
});

export default router;