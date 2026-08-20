import * as Icons from "lucide-react";
import Link from "next/link";

const Categories = ({
  categoriesList,
  loading,
}: {
  categoriesList: any;
  loading: boolean;
}) => {
  const getIconName = (name: any) => {
    const IconComponent = (Icons as any)[name];
    return IconComponent || Icons.Circle;
  };

  if (loading) {
    return (
      <div className="flex gap-4 sm:gap-5 items-center animate-pulse overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
          <span
            key={i}
            className="flex flex-col animate-pulse items-center p-2 rounded-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group min-w-[80px] sm:min-w-[100px] bg-white"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors"></div>
            <span className="bg-gray-200 py-1 px-5 rounded-sm h-4 w-16"></span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-gray-800">Categories</h1>
      <div className="flex gap-4 sm:gap-5 items-center overflow-x-auto pb-4 scrollbar-hide">
        {categoriesList.slice(0, 7).map((cat: any) => {
          const IconComponent = getIconName(cat.icon);
          return (
            <Link
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              key={cat.id}
              className="flex flex-col items-center p-2 rounded-full   transition-all duration-300 cursor-pointer group min-w-[80px] sm:min-w-[100px] bg-white hover:bg-orange-50"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors group-hover:bg-orange-200">
                <IconComponent className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 text-center whitespace-nowrap transition-colors group-hover:text-orange-600">
                {cat.name}
              </h3>
            </Link>
          );
        })}
        <Link
          href={"/categories"}
          className="flex flex-col items-center p-2 rounded-full transition-all duration-300 cursor-pointer group min-w-[80px] sm:min-w-[100px] bg-white hover:bg-orange-50"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center transition-colors group-hover:bg-orange-200">
            <Icons.LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 text-center whitespace-nowrap transition-colors group-hover:text-orange-600">
            more
          </h3>
        </Link>
      </div>
    </div>
  );
};

export default Categories;
