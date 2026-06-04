import { type ReactNode, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { CartProvider, useCart } from "./context/CartContext";
import Onboarding, { isSessionWelcomed } from "./components/Onboarding";
import CampusPage from "./pages/CampusPage";
import CafeteriaPage from "./pages/CafeteriaPage";
import CartPage from "./pages/CartPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PaymentDetailPage from "./pages/PaymentDetailPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import TurnoPage from "./pages/TurnoPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import IcesiCampusMap from "./components/map/IcesiCampusMap";

// ── route guards ──────────────────────────────────────────────────────────────

function GuardStudent({ children }: { children: ReactNode }) {
  const { session } = useCart();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function GuardAdmin({ children }: { children: ReactNode }) {
  const { session } = useCart();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === "student") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function GuardPublic({ children }: { children: ReactNode }) {
  const { session } = useCart();
  if (session)
    return <Navigate to={session.role === "admin" ? "/admin" : "/"} replace />;
  return <>{children}</>;
}

// ── onboarding gate ───────────────────────────────────────────────────────────

function greetingName(
  session: { name?: string; email?: string } | null,
): string {
  if (!session) return "";
  const n = session.name?.trim();
  if (n) return n;
  if (session.email) {
    const prefix = session.email.split("@")[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "";
}

function OnboardingGate() {
  const { session } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (session?.role === "student" && !isSessionWelcomed()) {
      setShow(true);
    }
  }, [session]);

  if (!show) return null;
  return (
    <Onboarding name={greetingName(session)} onDone={() => setShow(false)} />
  );
}

// ── app ───────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* public / auth */}
      <Route
        path="/login"
        element={
          <GuardPublic>
            <LoginPage />
          </GuardPublic>
        }
      />
      <Route
        path="/register"
        element={
          <GuardPublic>
            <RegisterPage />
          </GuardPublic>
        }
      />

      {/* student routes */}
      <Route
        path="/"
        element={
          <GuardStudent>
            <CampusPage />
          </GuardStudent>
        }
      />
      <Route
        path="/cafeteria/:slug"
        element={
          <GuardStudent>
            <CafeteriaPage />
          </GuardStudent>
        }
      />
      <Route
        path="/cart"
        element={
          <GuardStudent>
            <CartPage />
          </GuardStudent>
        }
      />
      <Route
        path="/payment/method"
        element={
          <GuardStudent>
            <PaymentMethodPage />
          </GuardStudent>
        }
      />
      <Route
        path="/payment/detail"
        element={
          <GuardStudent>
            <PaymentDetailPage />
          </GuardStudent>
        }
      />
      <Route
        path="/payment/confirm"
        element={
          <GuardStudent>
            <PaymentConfirmPage />
          </GuardStudent>
        }
      />
      <Route
        path="/turno"
        element={
          <GuardStudent>
            <TurnoPage />
          </GuardStudent>
        }
      />
      <Route
        path="/profile"
        element={
          <GuardStudent>
            <ProfilePage />
          </GuardStudent>
        }
      />
      <Route
        path="/mapa"
        element={
          <GuardStudent>
            <IcesiCampusMap />
          </GuardStudent>
        }
      />

      {/* admin routes */}
      <Route
        path="/admin"
        element={
          <GuardAdmin>
            <AdminPage />
          </GuardAdmin>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppRoutes />
      <OnboardingGate />
    </CartProvider>
  );
}
