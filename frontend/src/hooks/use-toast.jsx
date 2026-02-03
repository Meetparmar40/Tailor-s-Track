import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

/**
 * Custom toast hook with pre-configured styles and messages
 * Usage: const { showSuccess, showError, showWarning, showInfo } = useToast();
 */
export const useToast = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      duration: 4000,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      duration: 5000,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, {
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      duration: 4500,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, {
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      duration: 4000,
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      icon: <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />,
      ...options,
    });
  };

  const dismissToast = (toastId) => {
    toast.dismiss(toastId);
  };

  const showPromise = (promise, messages, options = {}) => {
    return toast.promise(promise, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showPromise,
    dismissToast,
    toast, // expose raw toast for advanced usage
  };
};

// Direct export for non-hook usage (in stores, utilities)
export const notify = {
  success: (message, options = {}) => {
    toast.success(message, { duration: 4000, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { duration: 5000, ...options });
  },
  warning: (message, options = {}) => {
    toast.warning(message, { duration: 4500, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { duration: 4000, ...options });
  },
  loading: (message, options = {}) => {
    return toast.loading(message, options);
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  promise: (promise, messages) => {
    return toast.promise(promise, messages);
  },
};
