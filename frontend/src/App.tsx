import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastContainer } from "./components/Toast";
import LandingPage from "./pages/LandingPage";
import PoetryGenerator from "./pages/PoetryGenerator";
import GenerationResult from "./pages/GenerationResult";
import HistoryPage from "./pages/HistoryPage";
import HowItWorks from "./pages/HowItWorks";
import AboutProject from "./pages/AboutProject";
import ResearchMode from "./pages/ResearchMode";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/sang-tac"
          element={
            <Layout>
              <PoetryGenerator />
            </Layout>
          }
        />
        <Route
          path="/ket-qua/:generationId"
          element={
            <Layout>
              <GenerationResult />
            </Layout>
          }
        />
        <Route
          path="/lich-su"
          element={
            <Layout>
              <HistoryPage />
            </Layout>
          }
        />
        <Route
          path="/cach-hoat-dong"
          element={
            <Layout>
              <HowItWorks />
            </Layout>
          }
        />
        <Route
          path="/ve-du-an"
          element={
            <Layout>
              <AboutProject />
            </Layout>
          }
        />
        <Route
          path="/nghien-cuu"
          element={
            <Layout noFooter>
              <ResearchMode />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <div className="max-w-xl mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-bold text-[#252932] mb-3">404</h1>
                <p className="text-[#5f6673] mb-6">
                  Trang bạn tìm không tồn tại.
                </p>
                <a
                  href="/"
                  className="text-[#3f4a6b] hover:underline font-medium"
                >
                  ← Về trang chủ
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
