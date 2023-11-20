import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="h-full bg-slate-100">
    <Navbar />
    <main className="pt-40 pb-20 bg-slate-100">
      {children}
    </main>
    <Footer />
  </div>;
};

export default Layout;