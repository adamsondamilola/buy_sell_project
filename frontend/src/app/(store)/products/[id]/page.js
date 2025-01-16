"use client";
import { useParams } from "next/navigation";
import RecentProductsComponent from "../../../../../components/Products/RecentProducts";
import AppStrings from "../../../../../constants/Strings";
import { useEffect } from "react";
import camelCaseToTitleCase from "../../../../../utils/camelCaseToTitleCase";

const ProductsSubCatList = () => {
    const params = useParams();
    const subcat = camelCaseToTitleCase(params?.id).replaceAll('-', ' ') || "Products";

    useEffect(() => {
       window.document.title = `${subcat} - ${AppStrings.title}`;
    }, [subcat]);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">{subcat}</h1>
            <RecentProductsComponent />
        </div>
    );
};

export default ProductsSubCatList;