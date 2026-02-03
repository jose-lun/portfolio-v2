import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LogisticMapLesson from "./sections/LogisticMapLesson";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons/logistic-map" element={<LogisticMapLesson />} />
    </Routes>
  );
}
