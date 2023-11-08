import { Route, Routes } from "react-router-dom";
import PATHS from "./common/routes";
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/Chat";
import Staff from "./pages/Staff";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<LandingPage />} />
      <Route
        path={"/chat/:id"}
        element={
          <ProtectedRoute role={["USER"]}>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path={"/staff"}
        element={
          <ProtectedRoute role={["STAFF", "ADMIN"]}>
            <Staff />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
