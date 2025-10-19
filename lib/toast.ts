import { toast as sonnerToast, ExternalToast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastOptions extends ExternalToast {
  description?: string;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
      className: 'toast-success',
      style: {
        backgroundColor: 'hsl(var(--success-bg, 142 76% 36%))',
        borderColor: 'hsl(var(--success-border, 142 76% 36%))',
        color: 'white',
      },
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
      className: 'toast-error',
      style: {
        backgroundColor: 'hsl(var(--destructive, 0 84% 60%))',
        borderColor: 'hsl(var(--destructive, 0 84% 60%))',
        color: 'white',
      },
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
      className: 'toast-warning',
      style: {
        backgroundColor: 'hsl(var(--warning-bg, 45 93% 47%))',
        borderColor: 'hsl(var(--warning-border, 45 93% 47%))',
        color: 'white',
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
      className: 'toast-info',
      style: {
        backgroundColor: 'hsl(var(--info-bg, 211 84% 64%))',
        borderColor: 'hsl(var(--info-border, 211 84% 64%))',
        color: 'white',
      },
    });
  },

  // Default toast
  default: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, options);
  },

  // Custom toast
  custom: (jsx: React.ReactNode, options?: ToastOptions) => {
    return sonnerToast.custom(jsx, options);
  },

  // Promise toast
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: (data: T) => string;
      error: (error: any) => string;
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: (data) => ({
        message: options.success(data),
        style: {
          backgroundColor: 'hsl(var(--success-bg, 142 76% 36%))',
          borderColor: 'hsl(var(--success-border, 142 76% 36%))',
          color: 'white',
        },
      }),
      error: (error) => ({
        message: options.error(error),
        style: {
          backgroundColor: 'hsl(var(--destructive, 0 84% 60%))',
          borderColor: 'hsl(var(--destructive, 0 84% 60%))',
          color: 'white',
        },
      }),
    });
  },

  // Loading toast
  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, options);
  },

  // Dismiss specific toast
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    return sonnerToast.dismiss();
  },
};

// Export individual methods for convenience
export const { success, error, warning, info } = toast;

// API Error Handler
export const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
  const message = error?.response?.data?.message || 
                  error?.message || 
                  defaultMessage;
  
  toast.error(message);
  console.error('API Error:', error);
};

// API Success Handler
export const handleApiSuccess = (message: string, data?: any) => {
  toast.success(message);
  if (data) {
    console.log('API Success:', data);
  }
};

// Async operation wrapper with toast notifications
export const withToast = async <T,>(
  operation: () => Promise<T>,
  options: {
    loading?: string;
    success?: (data: T) => string;
    error?: (error: any) => string;
  }
): Promise<T> => {
  const loadingToast = options.loading ? toast.loading(options.loading) : null;

  try {
    const result = await operation();
    
    if (loadingToast) {
      toast.dismiss(loadingToast);
    }
    
    if (options.success) {
      toast.success(options.success(result));
    }
    
    return result;
  } catch (error) {
    if (loadingToast) {
      toast.dismiss(loadingToast);
    }
    
    if (options.error) {
      toast.error(options.error(error));
    } else {
      handleApiError(error);
    }
    
    throw error;
  }
};
