import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Archive from "./pages/archive/Archive";
import ItemDetail from "./pages/Detail/ItemDetail";
import Lookbook from "./pages/lookbook/Lookbook";
import NewLookbook from "./pages/lookbook/NewLookbook";
import Data from "./pages/data/Data";
import Error from "./pages/Error";
import Header from "./component/Header";
import Footer from "./component/Footer";

export default function Router() {
  return (
    <div>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/itemDetail/:id" element={<ItemDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/newLookbook/:id" element={<NewLookbook />} />
          <Route path="/data" element={<Data />} />

          <Route path="*" element={<Error />} />
        </Routes>
        <Footer></Footer>
      </HashRouter>
    </div>
  );
}
