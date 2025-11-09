// src/utils/toast.js
import { toast } from 'react-toastify';

export const notify = {
  success: (msg: string, options = {}) => toast.success(msg, options),
  error: (msg: string, options = {}) => toast.error(msg, options),
  info: (msg: string, options = {}) => toast.info(msg, options),
  warning: (msg: string, options = {}) => toast.warning(msg, options),
};
