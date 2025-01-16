/*export const metadata = {
    title: `Search - ${AppStrings.title}`,
    description: AppStrings.description,
    metadataBase: new URL(process.env.website)
  };*/
 'use client'
import { Suspense } from "react";
import { SearchResultComponent } from "../../../../components/SearchResult";
import AppStrings from "../../../../constants/Strings";

const Search = () => {
  return (
    <Suspense>
    <SearchResultComponent/>
    </Suspense>
  )
};

export default Search;
