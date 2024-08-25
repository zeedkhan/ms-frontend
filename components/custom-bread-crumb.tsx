"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb";
import { useSearchParams } from "next/navigation";

type Route = {
    title: string;
    url: string;
}

type CustomBreadCrumb = {
    routes: Route[]
}


const CustomBreadCrumb = ({ routes }: CustomBreadCrumb) => {
    const searchParam = useSearchParams();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {routes.map((item, index) => (
                    <div key={index} className="dark:text-white flex items-center space-x-1">
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink asChild >
                                <Link href={item.url + "?" + searchParam}>{item.title}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {index < routes.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default CustomBreadCrumb;