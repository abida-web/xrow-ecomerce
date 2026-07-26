export const badgeColorApplier = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-blue-500";
    case "processing":
      return "bg-yellow-500";
    case "shipped":
      return "bg-purple-500";
    case "delivered":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
