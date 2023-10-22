import { Route, Routes } from "react-router-dom";
import PATHS from "./common/routes";
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/Chat";
import Staff from "./pages/Staff";

function App() {
  return (
    <Routes>
      <Route path={PATHS.LANDING_PAGE} element={<LandingPage />} />
      <Route path={PATHS.CHAT_PAGE()} element={<Chat />} />
      <Route path={PATHS.STAFF_PAGE} element={<Staff />} />
    </Routes>
  );
}

export default App;
