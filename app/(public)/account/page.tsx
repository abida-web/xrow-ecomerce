"use client";

import { authClient } from "@/lib/auth-client";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Pencil,
  User,
  Loader2,
  Bookmark,
  Fingerprint,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Types
interface OrderItem {
  id: string;
  variant?: {
    product?: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface AccountData {
  name?: string;
  email?: string;
  orders?: Order[];
}

interface PasswordState {
  currentPassword: string;
  newPassWord: string;
}

const AccountPage = () => {
  const [openedTab, setOpenedTab] = useState<"USERDATA" | "ORDERHISTORY">(
    "USERDATA",
  );
  const [editingField, setEditingField] = useState<"name" | "email" | null>(
    null,
  );
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectStatus, setSelectStatus] = useState<string>("");
  const [passWords, setPassWords] = useState<PasswordState>({
    currentPassword: "",
    newPassWord: "",
  });

  const { data, isLoading, error, refetch } = useQuery<AccountData>({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await fetch("/api/public/account/");
      if (!response.ok) {
        throw new Error("Failed to fetch account data");
      }
      return await response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
    }
  }, [data]);

  const handleUpdateName = async () => {
    await authClient.updateUser({
      name: name,
    });
    setEditingField(null);
    refetch();
  };

  const handleUpdateEmail = async () => {
    await authClient.changeEmail({
      newEmail: email,
    });
    setEditingField(null);
    refetch();
  };

  const handleChangePassword = async () => {
    await authClient.changePassword({
      newPassword: passWords.newPassWord,
      currentPassword: passWords.currentPassword,
      revokeOtherSessions: true,
    });
    setPassWords({
      currentPassword: "",
      newPassWord: "",
    });
  };

  const filteredStatuses = useMemo(() => {
    if (!data?.orders) return [];
    return [...new Set(data.orders.map((ord: Order) => ord.status))];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data?.orders) return [];
    return selectStatus
      ? data.orders.filter((order) => order.status === selectStatus)
      : data.orders;
  }, [selectStatus, data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Failed to load account data</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl">Profile</h1>
      <div className="flex items-center gap-5 mt-5">
        <button
          onClick={() => setOpenedTab("USERDATA")}
          className={`text-lg font-semibold shadow shadow-gray-500 rounded-full py-1 px-5 transition-all duration-300 ${
            openedTab === "USERDATA" && "bg-orange-500 shadow-white text-white"
          }`}
        >
          User data
        </button>
        <button
          onClick={() => setOpenedTab("ORDERHISTORY")}
          className={`text-lg font-semibold shadow shadow-gray-500 rounded-full py-1 px-5 transition-all duration-300 ${
            openedTab === "ORDERHISTORY" &&
            "bg-orange-500 shadow-white text-white"
          }`}
        >
          Order history
        </button>
      </div>

      {openedTab === "USERDATA" && data && (
        <div>
          <div className="bg-white/10 mt-5 rounded-2xl p-5">
            <h1 className="text-lg mb-5">Personal Data</h1>

            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <User size={20} />
                </span>
                <span className="text-gray-500">Name:</span>
                {editingField === "name" ? (
                  <input
                    value={name}
                    className="border border-gray-500 px-4 py-1 rounded-lg"
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <span> {data.name}</span>
                )}
              </p>
              <button
                onClick={() => {
                  if (editingField === "name") {
                    handleUpdateName();
                  } else {
                    setEditingField("name");
                  }
                }}
                className="text-[16px] flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                {editingField === "name" ? (
                  <Bookmark size={20} />
                ) : (
                  <Pencil size={20} />
                )}
                {editingField === "name" ? "Save" : "Edit"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <Mail size={20} />
                </span>
                <span className="text-gray-500">Email:</span>
                {editingField === "email" ? (
                  <input
                    value={email}
                    type="email"
                    className="border border-gray-500 px-4 py-1 rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <span> {data.email}</span>
                )}
              </p>
              <button
                onClick={() => {
                  if (editingField === "email") {
                    handleUpdateEmail();
                  } else {
                    setEditingField("email");
                  }
                }}
                className="text-[16px] flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                {editingField === "email" ? (
                  <Bookmark size={20} />
                ) : (
                  <Pencil size={20} />
                )}
                {editingField === "email" ? "Save" : "Edit"}
              </button>
            </div>
          </div>

          <div className="bg-white/10 mt-5 rounded-2xl p-5">
            <h1 className="text-lg">Login and password</h1>
            <p className="mb-3 mt-10 text-orange-500">Change password</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <Fingerprint size={20} />
                </span>
                <span className="text-gray-500">Current password:</span>
                <input
                  value={passWords.currentPassword}
                  className="border border-gray-500 px-4 py-1 rounded-lg"
                  onChange={(e) =>
                    setPassWords({
                      ...passWords,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </p>
              <button
                onClick={handleChangePassword}
                className="text-[16px] flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                <Bookmark /> Save
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <Fingerprint size={20} />
                </span>
                <span className="text-gray-500">New password:</span>
                <input
                  value={passWords.newPassWord}
                  className="border border-gray-500 px-4 py-1 rounded-lg"
                  onChange={(e) =>
                    setPassWords({
                      ...passWords,
                      newPassWord: e.target.value,
                    })
                  }
                />
              </p>
            </div>
          </div>
        </div>
      )}

      {openedTab === "ORDERHISTORY" && (
        <div className="mt-5">
          <select
            className="bg-white/20 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={selectStatus}
            onChange={(e) => setSelectStatus(e.target.value)}
          >
            <option className="bg-black" value="">
              Filter
            </option>
            {filteredStatuses.map((sta: string, i: number) => (
              <option className="bg-black" key={i} value={sta}>
                {sta}
              </option>
            ))}
          </select>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {filteredData.map((order: Order) => (
              <div key={order.id} className="bg-white/10 p-5 rounded-lg">
                <div className="flex items-center gap-5">
                  <h1 className="font-semibold">AFN {order.total}</h1>
                  <p
                    className={`px-3 w-fit text-xs py-px rounded-full ${badgeColorApplier(order.status)}`}
                  >
                    {order.status}
                  </p>
                </div>
                <p className="text-gray-400 text-xs">#{order.id.slice(0, 7)}</p>
                <p className="text-gray-400 text-xs">
                  Order date:
                  <span className="text-orange-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {order.items.map((item: OrderItem) => (
                    <div key={item.id}>
                      <h1 className="font-semibold">
                        {item?.variant?.product?.name}
                      </h1>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
