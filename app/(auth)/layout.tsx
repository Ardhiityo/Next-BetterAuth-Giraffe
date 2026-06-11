import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="container mx-auto flex justify-center items-center">
      {children}
    </section>
  );
};

export default Layout;
