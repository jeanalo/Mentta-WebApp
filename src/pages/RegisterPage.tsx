import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

type Role = "student" | "admin";

const ROLE_OPTIONS: {
  id: Role;
  label: string;
  sublabel: string;
  icon: string;
}[] = [
  {
    id: "student",
    label: "Comunidad Icesi",
    sublabel: "Estudiante, profesor o staff",
    icon: "🎓",
  },
  {
    id: "admin",
    label: "Administrador de cafetería",
    sublabel: "Gestiona pedidos y menú",
    icon: "🍽️",
  },
];

function EyeOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    login(name.trim(), email.trim().toLowerCase(), role);
    navigate(role === "admin" ? "/admin" : "/");
  }

  const fieldStyle: React.CSSProperties = {
    background: "#1C1C21",
    border: "1.5px solid #3A3A44",
    borderRadius: 14,
    padding: "13px 16px",
    fontFamily: "Satoshi",
    fontWeight: 400,
    fontSize: 15,
    color: "var(--text-primary)",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const eyeBtn: React.CSSProperties = {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      style={{
        background: "#0D0D0F",
        minHeight: "100svh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, padding: "40px 24px 60px" }}>
        {/* logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
          }}
        >
          <img
            src="/imagenes/VectorMentta.png"
            alt="Mentta logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "Satoshi",
              fontWeight: 800,
              fontSize: 20,
              color: "#F4F4F5",
            }}
          >
            Mentta
          </span>
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
              Crear cuenta
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
              Únete a la red de cafeterías Icesi
            </p>
          </div>

          {/* role selector */}
          <div>
            <label
              style={{
                display: "block",
                fontFamily: "Satoshi",
                fontWeight: 600,
                fontSize: 13,
                color: "#A1A1AA",
                marginBottom: 8,
              }}
            >
              Tipo de cuenta
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    background:
                      role === opt.id ? "rgba(84,84,242,0.12)" : "#1C1C21",
                    border:
                      role === opt.id
                        ? "1.5px solid rgba(84,84,242,0.5)"
                        : "1.5px solid #2A2A35",
                    textAlign: "left",
                    transition: "all 0.15s",
                    boxShadow:
                      role === opt.id
                        ? "0 2px 8px rgba(99, 102, 241, 0.25)"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 700,
                        fontSize: 14,
                        color: role === opt.id ? "#7C7EF7" : "#F4F4F5",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Satoshi",
                        fontWeight: 400,
                        fontSize: 12,
                        color: "#717178",
                        marginTop: 1,
                      }}
                    >
                      {opt.sublabel}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      flexShrink: 0,
                      border:
                        role === opt.id
                          ? "2px solid #5454F2"
                          : "2px solid #3A3A44",
                      background: role === opt.id ? "#5454F2" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {role === opt.id && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 3L3 5L7 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontFamily: "Satoshi",
                fontWeight: 600,
                fontSize: 13,
                color: "#A1A1AA",
              }}
            >
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Tu nombre"
              style={fieldStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#5454F2";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#3A3A44";
              }}
            />
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

          {/* password fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Mín. 6 caracteres"
                  style={{ ...fieldStyle, paddingRight: 44 }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#5454F2";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#3A3A44";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={eyeBtn}
                >
                  {showPw ? <EyeOffIcon /> : <EyeOnIcon />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "Satoshi",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#A1A1AA",
                }}
              >
                Confirmar contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                  placeholder="Repite la contraseña"
                  style={{
                    ...fieldStyle,
                    paddingRight: 44,
                    borderColor:
                      confirm && confirm !== password ? "#F87171" : "#3A3A44",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      confirm !== password ? "#F87171" : "#5454F2";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      confirm !== password ? "#F87171" : "#3A3A44";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={eyeBtn}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeOnIcon />}
                </button>
              </div>
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
            Crear cuenta →
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
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              style={{
                color: "#5454F2",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
