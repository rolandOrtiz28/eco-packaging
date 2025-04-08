import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import SidebarCart from "./SidebarCart";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* SidebarCart in bottom-left corner */}
      <div className="fixed bottom-4 left-4 z-40">
        <SidebarCart />
      </div>
      {/* ChatWidget in bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <ChatWidget />
      </div>
    </div>
  );
}

export default Layout;