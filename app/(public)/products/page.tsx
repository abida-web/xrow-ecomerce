import { Suspense } from "react";
import ProductsClient from "../_components/ProductClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-orange-500">Loading products...</div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
