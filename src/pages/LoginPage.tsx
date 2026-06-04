import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function EyeOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1 9C3 5 6 3 9 3C12 3 15 5 17 9C15 13 12 15 9 15C6 15 3 13 1 9Z"
        stroke="#717178"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="9" cy="9" r="2.5" stroke="#717178" strokeWidth="1.4" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 2L16 16M7.5 6.5C7.96 6.18 8.46 6 9 6C10.66 6 12 7.34 12 9C12 9.54 11.82 10.04 11.5 10.5"
        stroke="#717178"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 4.5C3.4 5.7 2.1 7.2 1 9C3 13 6 15 9 15C10.5 15 12 14.4 13.3 13.5"
        stroke="#717178"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M15 12.5C16.2 11.2 17 9.8 17 9C15 5 12 3 9 3C7.8 3 6.5 3.4 5.4 4"
        stroke="#717178"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Role = "student" | "admin";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    // Simulated auth — any credentials accepted, role from selector
    const name = email.split("@")[0].replace(/[._]/g, " ");
    login(name, email.trim().toLowerCase(), role);
    navigate(role === "admin" ? "/admin" : "/");
  }

  const fieldStyle: React.CSSProperties = {
    background: "#1C1C21",
    border: "1.5px solid #3A3A44",
    borderRadius: 14,
    padding: "14px 16px",
    fontFamily: "Satoshi",
    fontWeight: 400,
    fontSize: 15,
    color: "var(--text-primary)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "#0D0D0F",
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, padding: "40px 24px" }}>
        {/* logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <img
              src="/imagenes/VectorMentta.png"
              alt="Mentta logo"
              style={{ width: 40, height: 40, objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "Satoshi",
                fontWeight: 800,
                fontSize: 24,
                color: "#F4F4F5",
              }}
            >
              Mentta
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "Satoshi",
              fontWeight: 400,
              fontSize: 14,
              color: "#717178",
            }}
          >
            Universidad Icesi · Sistema de turnos
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 4px",
                fontFamily: "Satoshi",
                fontWeight: 700,
                fontSize: 26,
                color: "#F4F4F5",
              }}
            >
              Iniciar sesión
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "Satoshi",
                fontWeight: 400,
                fontSize: 14,
                color: "#717178",
              }}
            >
              Bienvenido de nuevo
            </p>
          </div>

          {/* role selector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: 4,
              background: "#1C1C21",
              borderRadius: 14,
              border: "1.5px solid #2A2A35",
            }}
          >
            {(
              [
                ["student", "Estudiante"],
                ["admin", "Administrador"],
              ] as [Role, string][]
            ).map(([r, label]) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 11,
                  border: "none",
                  cursor: "pointer",
                  background: role === r ? "#5454F2" : "transparent",
                  fontFamily: "Satoshi",
                  fontWeight: 700,
                  fontSize: 13,
                  color: role === r ? "#fff" : "#717178",
                  transition: "all 0.15s",
                  boxShadow:
                    role === r ? "0 2px 8px rgba(99,102,241,0.25)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontFamily: "Satoshi",
                fontWeight: 600,
                fontSize: 13,
                color: "#A1A1AA",
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="usuario@icesi.edu.co"
              style={fieldStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#5454F2";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#3A3A44";
              }}
            />
          </div>

          {/* password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontFamily: "Satoshi",
                fontWeight: 600,
                fontSize: 13,
                color: "#A1A1AA",
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                style={{ ...fieldStyle, paddingRight: 48 }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#5454F2";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3A3A44";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
              </button>
            </div>
          </div>

          {/* error */}
          {error && (
            <div
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <span
                style={{
                  fontFamily: "Satoshi",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#F87171",
                }}
              >
                {error}
              </span>
            </div>
          )}

          {/* submit */}
          <button
            type="submit"
            style={{
              padding: "15px 24px",
              borderRadius: 14,
              border: "none",
              background: "#5454F2",
              fontFamily: "Satoshi",
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(84,84,242,0.4)",
              marginTop: 4,
            }}
          >
            Iniciar sesión →
          </button>

          <p
            style={{
              textAlign: "center",
              fontFamily: "Satoshi",
              fontWeight: 400,
              fontSize: 14,
              color: "#717178",
              margin: 0,
            }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "#5454F2",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
