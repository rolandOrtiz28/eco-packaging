
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import SidebarCart from "./SidebarCart";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4 z-40">
        <SidebarCart />
        <ChatWidget />
      </div>
    </div>
  );
};

export default Layout;
