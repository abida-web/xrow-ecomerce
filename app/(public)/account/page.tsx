"use client";

import { authClient } from "@/lib/auth-client";
import { badgeColorApplier } from "@/lib/helper-functions";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Mail,
  Pencil,
  User,
  Loader2,
  Bookmark,
  Fingerprint,
  Star,
  X,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReviewModal from "../_components/ReviewModal";
import { addReviewtoProduct } from "@/app/actions/product-actions";

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
  organization: {
    id: string;
    currency: string;
  };
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
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    productId: "",
    organizationId: "",
    orderItemId: "",
    rating: 0,
    title: "",
    comment: "",
  });
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
    toast.success("Name updated successfully");
    setEditingField(null);
    refetch();
  };

  const handleUpdateEmail = async () => {
    await authClient.changeEmail({
      newEmail: email,
    });
    toast.success("Email updated successfully");
    setEditingField(null);
    refetch();
  };

  const handleChangePassword = async () => {
    await authClient.changePassword({
      newPassword: passWords.newPassWord,
      currentPassword: passWords.currentPassword,
      revokeOtherSessions: true,
    });
    toast.success("Password change successfully");
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
  const addReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await addReviewtoProduct(reviewForm);
      if (!res.success) {
        throw new Error(res.error || "Failed to add review");
      }
      return res;
    },
    onSuccess: () => {
      setReviewForm({
        productId: "",
        organizationId: "",
        orderItemId: "",
        rating: 0,
        title: "",
        comment: "",
      });
    },
  });

  const handleWriteReview = (
    productId: string,
    organizationId: string,
    orderItemId: string,
  ) => {
    setReviewForm({
      ...reviewForm,
      productId: productId,
      organizationId: organizationId,
      orderItemId: orderItemId,
    });
  };
  const handleAddReveiw = () => {
    addReviewMutation.mutate();
  };
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
  console.log(reviewForm);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

      <div className="flex items-center gap-5 mt-5">
        <button
          onClick={() => setOpenedTab("USERDATA")}
          className={`text-lg font-semibold shadow-sm rounded-full py-1 px-5 transition-all duration-300 ${
            openedTab === "USERDATA"
              ? "bg-orange-500 text-white shadow-orange-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          User data
        </button>
        <button
          onClick={() => setOpenedTab("ORDERHISTORY")}
          className={`text-lg font-semibold shadow-sm rounded-full py-1 px-5 transition-all duration-300 ${
            openedTab === "ORDERHISTORY"
              ? "bg-orange-500 text-white shadow-orange-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Order history
        </button>
      </div>

      {openedTab === "USERDATA" && data && (
        <div>
          <div className="bg-white mt-5 rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-800 mb-5">
              Personal Data
            </h1>

            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <User size={20} />
                </span>
                <span className="text-gray-600">Name:</span>
                {editingField === "name" ? (
                  <input
                    value={name}
                    className="border border-gray-300 px-4 py-1 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <span className="text-gray-800 font-medium">
                    {" "}
                    {data.name}
                  </span>
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
                <span className="text-gray-600">Email:</span>
                {editingField === "email" ? (
                  <input
                    value={email}
                    type="email"
                    className="border border-gray-300 px-4 py-1 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <span className="text-gray-800 font-medium">
                    {" "}
                    {data.email}
                  </span>
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

          <div className="bg-white mt-5 rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-800">
              Login and password
            </h1>
            <p className="mb-3 mt-10 text-orange-500 font-medium">
              Change password
            </p>

            <div className="flex items-center justify-between mb-4">
              <p className="text-[16px] flex items-center gap-2">
                <span className="text-gray-500 mb-1">
                  <Fingerprint size={20} />
                </span>
                <span className="text-gray-600">Current password:</span>
                <input
                  value={passWords.currentPassword}
                  type="password"
                  className="border border-gray-300 px-4 py-1 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <span className="text-gray-600">New password:</span>
                <input
                  value={passWords.newPassWord}
                  type="password"
                  className="border border-gray-300 px-4 py-1 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="bg-gray-50 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
            value={selectStatus}
            onChange={(e) => setSelectStatus(e.target.value)}
          >
            <option className="bg-white" value="">
              Filter
            </option>
            {filteredStatuses.map((sta: string, i: number) => (
              <option className="bg-white" key={i} value={sta}>
                {sta}
              </option>
            ))}
          </select>

          <div className="mt-5 grid grid-cols-1 gap-3">
            {filteredData.map((order: Order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <h1 className="font-semibold text-gray-800">
                      {order?.organization?.currency} {order.total}
                    </h1>
                    <p
                      className={`px-3 w-fit text-xs py-px rounded-full ${badgeColorApplier(order.status)}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">#{order.id.slice(0, 7)}</p>
                <p className="text-gray-500 text-xs">
                  Order date:
                  <span className="text-orange-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <h1 className="mt-5  text-black">Products</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      {/* Product Image */}
                      <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {item?.variant?.product?.images ? (
                          <img
                            src={item.variant.product.images[0].url}
                            alt={item.variant.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-12 w-12 text-gray-300" />
                        )}
                      </div>

                      <h1 className="font-semibold text-gray-800">
                        {item?.variant?.product?.name || "Unnamed Product"}
                      </h1>

                      {item.quantity && (
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      )}

                      {item.price && (
                        <p className="text-sm font-medium text-gray-700">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                      {order.status === "delivered" && (
                        <button
                          onClick={() => {
                            handleWriteReview(
                              item?.variant?.product?.id,
                              order.organization.id,
                              item.id,
                            );
                            setOpenReviewModal(true);
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium border border-yellow-200"
                        >
                          <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                          Write Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal - Only shown when openReviewModal is true */}
      {openReviewModal && (
        <ReviewModal
          setOpenReviewModal={setOpenReviewModal}
          setReviewForm={setReviewForm}
          reviewForm={reviewForm}
          handleAddReveiw={handleAddReveiw}
          isPending={addReviewMutation.isPending}
        />
      )}
    </div>
  );
};

export default AccountPage;
