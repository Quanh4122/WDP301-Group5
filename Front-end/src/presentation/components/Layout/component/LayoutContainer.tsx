import Navbar from "../../home/components/Navbar";
import Footer from "../../home/components/Footer";
import Sidebar from "../../dashboard/components/Header";
import { useLocation } from "react-router-dom";

interface Props {
  children?: string | JSX.Element | JSX.Element[];
}

const LayoutContainer = ({ children }: Props) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/app/dashboard");

  return (
    <>
      <Navbar />
      {isDashboard ? (
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1 }}>{children}</div>
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Footer />
    </>
  );
};

export default LayoutContainer;