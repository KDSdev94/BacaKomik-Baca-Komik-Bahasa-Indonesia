import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Reader from "./pages/Reader";
import Search from "./pages/Search";
import Genre from "./pages/Genre";
import Type from "./pages/Type";
import Bookmark from "./pages/Bookmark";
import DaftarGenre from "./pages/DaftarGenre";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />} errorElement={<NotFound />}>
        <Route path="/" element={<Home />} />
        <Route path="/komik/:slug" element={<Detail />} />
        <Route path="/chapter/:slug" element={<Reader />} />
        <Route path="/search" element={<Search />} />
        <Route path="/genre/:slug" element={<Genre />} />
        <Route path="/type/:kind" element={<Type />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/daftar-genre" element={<DaftarGenre />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
