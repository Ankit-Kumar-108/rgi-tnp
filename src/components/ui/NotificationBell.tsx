"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Clock, Trash2, Loader2, ArrowRight } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBell {
  role: "student" | "external_student" | "alumni" | "recruiter"
}

export default function NotificationBell({role}: NotificationBell) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Verify if student token exists
  const token = typeof window !== "undefined" ? getToken(role) : null;

  // Map the role to the correct API endpoint folder. 
  // 'external_student' token maps to the '/api/external/...' route.
  const apiFolder = role === "external_student" ? "external" : role;
  const apiEndpoint= `/api/${apiFolder}/notifications`;

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiEndpoint}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json() as {
        success: boolean;
        items: NotificationItem[];
        unreadCount: number;
      };
      if (data.success) {
        setNotifications(data.items);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("[NotificationBell] Failed to fetch notifications:", error);
    }
  };

  // Poll for new notifications every 45 seconds if logged in
  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, link: string | null) => {
    if (!token) return;
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await fetch(`${apiEndpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (link) {
        setIsOpen(false);
        router.push(link);
      }
    } catch (error) {
      console.error("[NotificationBell] Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token || unreadCount === 0) return;
    setLoading(true);
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await fetch(`${apiEndpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ all: true }),
      });
    } catch (error) {
      console.error("[NotificationBell] Failed to mark all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 rounded-xl bg-muted hover:bg-accent text-muted-foreground border border-border transition-all duration-200 shadow-sm"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-destructive text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-card animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown glassmorphism feed */}
      {isOpen && (
        <div className="absolute right-0 mt-3.5 w-80 md:w-96 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-foreground">Notifications Feed</h4>
              <p className="text-[10px] text-muted-foreground">Stay updated on your placement process</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-xs font-bold text-brand hover:text-brand/80 transition-colors flex items-center gap-1"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse" />
                <p className="text-xs font-semibold">All caught up!</p>
                <p className="text-[10px] opacity-75 mt-0.5">No new placement updates available.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.link)}
                  className={`px-5 py-4 cursor-pointer hover:bg-muted/50 transition-colors flex gap-3.5 relative group ${
                    !n.isRead ? "bg-brand/5" : ""
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!n.isRead && (
                    <span className="absolute top-4 left-2 w-2 h-2 bg-brand rounded-full" />
                  )}

                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-black text-foreground leading-tight group-hover:text-brand transition-colors flex items-center gap-1.5 justify-between">
                      <span>{n.title}</span>
                      {n.link && <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1.5 group-hover:translate-x-0 transition-all text-muted-foreground flex-shrink-0" />}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {n.message}
                    </p>
                    <p className="text-[9px] text-muted-foreground/70 flex items-center gap-1 pt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
