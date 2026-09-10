import { Bell, BellDot, BellRing, CheckCheck, X } from "lucide-react";
import React, { useMemo, useCallback, useEffect, useRef } from "react";

interface Notification {
  id: string;
  createdAt: Date | null;
  shopId: string | null;
  type: string | null;
  title: string | null;
  message: string | null;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean | null;
}

interface NotificationProps {
  setIsNotificationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMarkAsRead: (notificationId: string) => Promise<void>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  notificationData?: Notification[];
}

const NotificationModal = ({
  setIsNotificationModalOpen,
  notificationData = [],
  handleMarkAsRead,
  selectedType,
  setSelectedType,
}: NotificationProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ FIX: Define filter types with consistent values
  const filterTypes = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "READ", label: "Read" },
      { value: "UNREAD", label: "Unread" },
    ],
    [],
  );

  // ✅ FIX: Filter logic using consistent values
  const filteredData = useMemo(() => {
    if (selectedType === "READ") {
      return notificationData.filter((noti) => noti.isRead === true);
    }
    if (selectedType === "UNREAD") {
      return notificationData.filter((noti) => noti.isRead === false);
    }
    return notificationData;
  }, [notificationData, selectedType]);

  const handleClose = useCallback(() => {
    setIsNotificationModalOpen(false);
  }, [setIsNotificationModalOpen]);

  const handleTypeChange = useCallback(
    (type: string) => {
      setSelectedType(type);
    },
    [setSelectedType],
  );

  const handleNotificationClick = useCallback(
    async (notificationId: string) => {
      await handleMarkAsRead(notificationId);
    },
    [handleMarkAsRead],
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setIsNotificationModalOpen]);

  const getFilterButtonClassName = useCallback(
    (type: string) => {
      const baseClasses =
        "mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300";
      const isActive = selectedType === type;
      return `${baseClasses} ${isActive ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`;
    },
    [selectedType],
  );

  return (
    <div
      className="fixed right-0 top-0 bg-white w-full sm:w-md h-full z-50 overflow-y-auto animate-in slide-in-from-right duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-orange-500" aria-hidden="true" />
          <h2
            id="notification-modal-title"
            className="text-xl font-semibold text-gray-800"
          >
            Notifications
          </h2>
          {notificationData.length > 0 && (
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {notificationData.length}
            </span>
          )}
        </div>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          aria-label="Close notifications"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-4 sm:px-6 py-2">
        <p className="text-xs text-orange-500">
          Click a notification to mark it as read
        </p>
      </div>

      {/* ✅ FIX: Filter buttons with consistent values */}
      <div className="flex items-center gap-3 px-4 sm:px-6">
        {filterTypes.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleTypeChange(filter.value)}
            className={getFilterButtonClassName(filter.value)}
            aria-pressed={selectedType === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-4 mt-4 px-4 sm:px-6 pb-6">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BellRing
              className="w-12 h-12 mx-auto text-gray-300 mb-3"
              aria-hidden="true"
            />
            <p className="text-sm">
              {selectedType === "READ"
                ? "No read notifications"
                : selectedType === "UNREAD"
                  ? "No unread notifications"
                  : "No notifications"}
            </p>
          </div>
        ) : (
          filteredData.map((noti) => (
            <div
              onClick={() => handleNotificationClick(noti.id)}
              key={noti.id}
              className="flex items-start gap-4 py-3 px-3 border-b border-gray-100 hover:bg-orange-50 rounded-lg cursor-pointer transition-all duration-200 group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNotificationClick(noti.id);
                }
              }}
            >
              <div className="flex-shrink-0 mt-1">
                {!noti.isRead ? (
                  <div
                    className="w-2.5 h-2.5 bg-orange-500 rounded-full"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCheck
                    className="w-4 h-4 text-green-500"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 truncate">
                  {noti.title}
                </h3>
                <p className="text-xs text-gray-500 break-words">
                  {noti.message}
                </p>
                {noti.createdAt && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(noti.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              {!noti.isRead && (
                <span className="text-[10px] font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Mark read
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
