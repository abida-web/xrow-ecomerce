"use client";
import React, { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import Popular from "./_components/Popular";
import BenfitStacticCards from "./_components/BenfitStacticCards";
import Categories from "./_components/Categories";
import toast from "react-hot-toast";
import { getCategories, getFeaturedProduct } from "../actions/product-actions";
import FeaturedProducts from "./_components/FeaturedProducts";
import PopularStores from "./_components/PopularStores";
import WhyUs from "./_components/WhyUs";

interface Category {
  id: string;
  name: string;
  createdAt: Date | null;
  icon: string | null;
}

interface FeaturedProduct {
  id: string;
  slug: string;
  image: string;
  category: string | undefined;
  name: string;
  brand: string | null;
  price: string;
  stock: number | null;
  comparePrice: string | null;
  owner: string;
}
interface TopStores {
  name: string;
  totalProduct: number;
  totalOrders: number;
}
interface TopProduct {
  id: string;
  slug: string;
  image: string | null;
  category: string | null;
  name: string;
  brand: string | null;
  price: string | null;
  comparePrice: string | null;
  stock: number | null;
  owner: string | null;
  totalSold: string | null;
}

interface ProductData {
  featured: FeaturedProduct[];
  topProducts: TopProduct[];
}

const PublicHomePage = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [topStores, setTopStores] = useState<TopStores[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  async function fetchCategoriesList() {
    try {
      setCategoriesLoading(true);
      const res = await getCategories();
      setCategoriesList(res || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }

  async function fetchProductsList() {
    try {
      setProductsLoading(true);
      const res = await getFeaturedProduct();
      setFeaturedProducts(res?.transformed || []);
      setTopProducts(res?.topProducts || []);
      setTopStores(res?.topStores || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoriesList();
    fetchProductsList();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Hero />
      <Categories categoriesList={categoriesList} loading={categoriesLoading} />
      <FeaturedProducts
        featuredProduct={featuredProducts}
        loading={productsLoading}
      />
      <PopularStores topStores={topStores} loading={productsLoading} />

      <Popular topProducts={topProducts} loading={productsLoading} />
      <BenfitStacticCards />
      <WhyUs />
    </div>
  );
};

export default PublicHomePage;
