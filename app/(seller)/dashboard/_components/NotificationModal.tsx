import { Bell, BellDot, BellRing, CheckCheck, X } from "lucide-react";
import React from "react";
interface NotificationProps {
  setIsNotificationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleMarkAsRead: (notificationId: string) => Promise<void>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  notificationData?: Array<{
    id: string;
    createdAt: Date | null;
    shopId: string | null;
    type: string | null;
    title: string | null;
    message: string | null;
    entityType: string | null;
    entityId: string | null;
    isRead: boolean | null;
  }>;
}
const NotificationModal = ({
  setIsNotificationModalOpen,
  notificationData,
  handleMarkAsRead,
  selectedType,
  setSelectedType,
}: NotificationProps) => {
  return (
    <div className="fixed right-0 top-0 text-black bg-white w-md p-3 h-full z-50 overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          {notificationData && notificationData?.length > 0 && (
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {notificationData.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsNotificationModalOpen(false)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <span className=" text-xs text-orange-500">
        To mark as read click the order
      </span>
      {/*Types */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setSelectedType("")}
          className={`mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300 ${selectedType === "" && "bg-orange-500 text-white"}`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedType("READ")}
          className={`mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300 ${selectedType === "READED" && "bg-orange-500 text-white"}`}
        >
          Readed
        </button>
        <button
          onClick={() => setSelectedType("UNREAD")}
          className={`mt-2 px-4 py-1.5 text-sm shadow shadow-sm rounded-lg cursor-pointer transition-all duration-300 ${selectedType === "UNREADED" && "bg-orange-500 text-white"}`}
        >
          Unreaded
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-5">
        {notificationData?.map((noti) => (
          <div
            onClick={() => handleMarkAsRead(noti.id)}
            key={noti.id}
            className="flex items-center gap-5 py-2 px-2 border-b border-gray-300/50 hover:bg-orange-500/10 cursor-pointer transition-all duration-300"
          >
            {!noti.isRead ? (
              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
            ) : (
              <span>
                <CheckCheck className="w-4 h-4 text-orange-500 rounded-full flex-shrink-0 mt-1.5" />
              </span>
            )}
            <div className="flex flex-col gap-px">
              <h1 className=" font-semibold">{noti.title}</h1>
              <p className=" text-xs text-gray-400">{noti.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationModal;
