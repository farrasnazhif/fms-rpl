import React from "react";
import { Navbar } from "./navbar";

export default function Layout({
  withNavbar,
  children,
}: {
  withNavbar?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {withNavbar && <Navbar />}
      {children}
    </div>
  );
}
