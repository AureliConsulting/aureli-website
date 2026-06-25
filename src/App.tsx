import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { getCalApi } from "@calcom/embed-react";
import "./styles/App.css";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { WorkflowModal } from "./components/WorkflowModal";
import type { WorkflowItem } from "./data/types";
import { useScrollEffects } from "./hooks/useScrollEffects";
import { useTheme } from "./hooks/useTheme";
import { About } from "./pages/About";
import { CaseStudies } from "./pages/CaseStudies";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function useRevealObserver(pathname: string) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);
}

function useComplexityBars(pathname: string) {
  useEffect(() => {
    const fills = document.querySelectorAll<HTMLElement>(".complexity-fill");
    if (!fills.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.width = `${el.dataset.width ?? "0"}%`;
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );

    fills.forEach((fill) => observer.observe(fill));
    return () => observer.disconnect();
  }, [pathname]);
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [modalWorkflow, setModalWorkflow] = useState<WorkflowItem | null>(null);

  useScrollEffects(theme, pathname);
  useRevealObserver(pathname);
  useComplexityBars(pathname);

  useEffect(() => {
    getCalApi({ namespace: "30min" }).then((cal) => {
      cal("ui", {
        theme,
        styles: {
          branding: { brandColor: theme === "dark" ? "#06b6d4" : "#7c3aed" },
        },
      });
    });
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home onOpenWorkflow={setModalWorkflow} />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/case-studies"
          element={<CaseStudies onOpenWorkflow={setModalWorkflow} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact theme={theme} />} />
      </Routes>
      <Footer />
      <WorkflowModal
        workflow={modalWorkflow}
        onClose={() => setModalWorkflow(null)}
      />
    </>
  );
}

export default App;
