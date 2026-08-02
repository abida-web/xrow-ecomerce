export const badgeColorApplier = (status: string | null) => {
  switch (status) {
    case "pending":
      return "bg-blue-500 text-white";
    case "confirmed":
      return "bg-cyan-500 text-white";
    case "preparing":
      return "bg-yellow-500 text-black";
    case "ready_for_pickup":
      return "bg-indigo-500 text-white";
    case "out_for_delivery":
      return "bg-purple-500 text-white";
    case "delivered":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
