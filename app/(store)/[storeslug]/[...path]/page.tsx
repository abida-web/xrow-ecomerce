"use client";

import { getStoreRelatedPages } from "@/app/actions/individualStore";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { sectionComponents } from "../_components/sectionRegistory";
import StoreRerenderer from "../_components/StoreRerenderer";

export default function StoreCatchAllPage() {
  const params = useParams();
  const pathname = usePathname();
  const storeslug = String(params.storeslug);

  const { data: pagesDataList, isLoading } = useQuery({
    queryKey: ["pages", storeslug],
    queryFn: () => getStoreRelatedPages(storeslug),
  });

  const pathSegments = params.path ?? [];
  const page =
    pathSegments?.length === 0
      ? pagesDataList?.find((p) => p.type === "home")
      : pagesDataList?.find((pa) => pa.slug === pathSegments?.join("/"));

  return (
    <div className="flex flex-col gap-5">
      {page && <StoreRerenderer type="live" selectedPage={page} />}
    </div>
  );
}
