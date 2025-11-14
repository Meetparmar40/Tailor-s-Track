// components/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABELS = {
  "": "Home",
  customers: "Customers",
  settings: "Settings",
  measurements: "Measurements",
  login: "Login",
};

export default function BreadCrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [{ name: LABELS[""] || "Home", path: "/" }];
  let acc = "";
  segments.forEach((seg) => {
    acc += `/${seg}`;
    crumbs.push({ name: LABELS[seg] || decodeURIComponent(seg), path: acc });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.path}>
            <BreadcrumbItem>
              {i < crumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link className="text-muted-foreground" to={c.path}>{c.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-muted-foreground">{c.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}