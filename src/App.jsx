import { useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LogisticMapLesson from "./lessons/LogisticMapLesson";
import TaylorSeriesLesson from "./lessons/TaylorSeriesLesson";

export default function App() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Only scroll to top when route actually changes (not on initial load/reload)
  useLayoutEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      window.scrollTo(0, 0);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <Routes key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons/logistic-map" element={<LogisticMapLesson />} />
      <Route path="/lessons/taylor-series" element={<TaylorSeriesLesson />} />
    </Routes>
  );
}
