import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import LandingView from "./pages/landing/Landing"; // 새로 만든 랜딩 컴포넌트
import Home from "./pages/home/Home";
import Archive from "./pages/archive/Archive";
import ItemDetail from "./pages/Detail/ItemDetail";
import Lookbook from "./pages/lookbook/Lookbook";
import NewLookbook from "./pages/lookbook/NewLookbook";
import Data from "./pages/data/Data";
import Error from "./pages/Error";
import Header from "./component/Header";
import Footer from "./component/Footer";

function AppLayout() {
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!isLandingPage && <Header />}

      <Routes>
        <Route path="/" element={<LandingView />} />

        <Route path="/home" element={<Home />} />

        <Route path="/archive" element={<Archive />} />
        <Route path="/itemDetail/:id" element={<ItemDetail />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/newLookbook" element={<NewLookbook />} />
        <Route path="/newLookbook/:id" element={<NewLookbook />} />
        <Route path="/data" element={<Data />} />

        <Route path="*" element={<Error />} />
      </Routes>

      {!isLandingPage && <Footer />}
    </>
  );
}

export default function Router() {
  return (
    <div>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </div>
  );
}
