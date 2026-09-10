"use client";

import { getHomePageForstore } from "@/app/actions/individualStore";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { sectionComponents } from "./_components/sectionRegistory";

const StoreFrontPages = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  const { data: page, isLoading } = useQuery({
    queryKey: ["home-page", storeslug],
    queryFn: () => getHomePageForstore(storeslug),
  });

  return (
    <div className="flex flex-col gap-2">
      {page?.sections
        .filter((section) => section.type !== "navbar")
        .sort((a: any, b: any) => a.position - b.position)
        .map((sec: any) => {
          const Component = (
            sectionComponents as Record<string, React.ComponentType<any>>
          )[sec.name];
          if (!Component) return null;
          return <Component key={sec.id} settings={sec} />;
        })}
    </div>
  );
};

export default StoreFrontPages;
