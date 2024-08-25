"use client";

import Filter from "@/components/storage/filter";
import Search from "@/components/storage/search";
import SearchView from "@/components/storage/search-view";

const Page = () => {
    return (
        <div className="px-8 pt-4">
            <Search />
            <Filter />
            <h1 className="text-2xl">Search results</h1>
            <SearchView />
        </div>
    )
};

export default Page;