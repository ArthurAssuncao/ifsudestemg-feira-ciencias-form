// hooks/useAlert.ts

import { useCallback, useState } from "react";
import Alert from "../components/Alert";

interface AlertOptions {
  title?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function useAlert() {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    options: AlertOptions;
  }>({
    isOpen: false,
    message: "",
    options: {},
  });

  const showAlert = useCallback(
    (message: string, options: AlertOptions = {}) => {
      setAlertState({
        isOpen: true,
        message,
        options,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const AlertComponent = useCallback(
    () => (
      <Alert
        isOpen={alertState.isOpen}
        message={alertState.message}
        onClose={hideAlert}
        {...alertState.options}
      />
    ),
    [alertState, hideAlert]
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
}
