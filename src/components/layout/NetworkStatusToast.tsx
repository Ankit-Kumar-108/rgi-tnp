"use client";

import { useEffect } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { toast } from "sonner";

const OFFLINE_TOAST_ID = "network-offline-toast";

/**
 * Global component that shows a persistent toast when the user goes offline
 * and dismisses it (with a success message) when they come back online.
 * Mount this once in the root layout.
 */
export function NetworkStatusToast() {
  const { isOnline, wasOffline } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("You're offline. Some features may not work.", {
        id: OFFLINE_TOAST_ID,
        duration: Infinity,
        dismissible: false,
      });
    } else {
      toast.dismiss(OFFLINE_TOAST_ID);

      if (wasOffline) {
        toast.success("You're back online!", { duration: 3000 });
      }
    }
  }, [isOnline, wasOffline]);

  return null;
}
