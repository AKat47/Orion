import React, { useState, useEffect, useCallback } from "react";

// A6 OVION ARCHITECTS — animated brand reveal slide
// Palette derived from the business card: warm taupe ground, near-black ink.

const COLORS = {
  bg: "#C5A693",
  bgDeep: "#B89881",
  ink: "#15110E",
  line: "#1a1512",
};

const FONT_DISPLAY = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const FONT_BODY = '"Jost", "Century Gothic", "Futura", sans-serif';

/* ---------- The circular Ovion logo, drawn in SVG ---------- */
function OvionMark({ size = 240, draw }) {
  const dash = 720;
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} aria-label="Ovion Architects logo">
      {/* broken outer ring (two arcs) */}
      <path
        d="M 110 60 A 170 170 0 0 0 110 340"
        fill="none"
        stroke={COLORS.ink}
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          strokeDasharray: dash,
          strokeDashoffset: draw ? 0 : dash,
          transition: "stroke-dashoffset 1.6s ease 0.2s",
        }}
      />
      <path
        d="M 290 60 A 170 170 0 0 1 290 340"
        fill="none"
        stroke={COLORS.ink}
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          strokeDasharray: dash,
          strokeDashoffset: draw ? 0 : dash,
          transition: "stroke-dashoffset 1.6s ease 0.2s",
        }}
      />
      {/* curved OVION text top */}
      <defs>
        <path id="topArc" d="M 130 95 A 130 130 0 0 1 270 95" fill="none" />
        <path id="botArc" d="M 122 300 A 135 135 0 0 0 278 300" fill="none" />
      </defs>
      <text
        fill={COLORS.ink}
        fontFamily={FONT_BODY}
        fontSize="34"
        letterSpacing="10"
        style={{ opacity: draw ? 1 : 0, transition: "opacity 0.8s ease 1.2s" }}
      >
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          OVION
        </textPath>
      </text>
      <text
        fill={COLORS.ink}
        fontFamily={FONT_BODY}
        fontSize="30"
        letterSpacing="6"
        style={{ opacity: draw ? 1 : 0, transition: "opacity 0.8s ease 1.4s" }}
      >
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">
          ARCHITECTS
        </textPath>
      </text>
      {/* The "A" monogram + circle */}
      <g
        style={{
          opacity: draw ? 1 : 0,
          transform: draw ? "scale(1)" : "scale(0.7)",
          transformOrigin: "200px 230px",
          transition: "opacity 0.9s ease 0.8s, transform 0.9s cubic-bezier(.2,.9,.3,1) 0.8s",
        }}
      >
        <path
          d="M 200 118 L 268 290 L 244 290 L 200 175 L 156 290 L 132 290 Z"
          fill={COLORS.ink}
        />
        <circle cx="200" cy="250" r="30" fill={COLORS.bg} />
        <circle cx="200" cy="250" r="30" fill="none" stroke={COLORS.ink} strokeWidth="0" />
      </g>
    </svg>
  );
}

/* ---------- contact line item ---------- */
function ContactRow({ icon, text, delay, show }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      <span
        style={{
          fontSize: 20,
          width: 34,
          height: 34,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          border: `1.5px solid ${COLORS.ink}`,
          borderRadius: "50%",
        }}
      >
        {icon}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 17, letterSpacing: 0.5, lineHeight: 1.35 }}>
        {text}
      </span>
    </div>
  );
}

export default function OvionSlide() {
  const slides = ["logo", "card", "tag"];
  const [i, setI] = useState(0);
  const [seed, setSeed] = useState(0); // forces re-mount of animations on slide change

  const go = useCallback(
    (n) => {
      setI((prev) => {
        const next = (prev + n + slides.length) % slides.length;
        return next;
      });
      setSeed((s) => s + 1);
    },
    [slides.length]
  );

  // auto-advance
  useEffect(() => {
    const t = setTimeout(() => go(1), 6000);
    return () => clearTimeout(t);
  }, [i, seed, go]);

  // keyboard nav
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, [i, seed]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: `radial-gradient(120% 120% at 50% 0%, ${COLORS.bg} 0%, ${COLORS.bgDeep} 100%)`,
        fontFamily: FONT_BODY,
        color: COLORS.ink,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-2%,1%)} }
      `}</style>

      {/* slide stage */}
      <div
        key={seed}
        style={{
          width: "min(940px, 100%)",
          aspectRatio: "16 / 9",
          position: "relative",
          background: COLORS.bg,
          borderRadius: 8,
          boxShadow: "0 40px 90px -30px rgba(20,17,14,.55)",
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* subtle grain/texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(20,17,14,.05) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.5,
            pointerEvents: "none",
            animation: "grain 8s ease-in-out infinite",
          }}
        />

        {/* ---------------- SLIDE 1: LOGO ---------------- */}
        {i === 0 && (
          <div style={{ display: "grid", placeItems: "center", gap: 8, zIndex: 1 }}>
            <OvionMark size={300} draw={drawn} />
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 26,
                letterSpacing: 14,
                marginTop: 4,
                opacity: drawn ? 1 : 0,
                transform: drawn ? "translateY(0)" : "translateY(16px)",
                transition: "opacity .8s ease 1.6s, transform .8s ease 1.6s",
              }}
            >
              A6&nbsp;&nbsp;O V I O N
            </div>
          </div>
        )}

        {/* ---------------- SLIDE 2: BUSINESS CARD ---------------- */}
        {i === 1 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1.15fr",
              zIndex: 1,
            }}
          >
            {/* left: mark */}
            <div
              style={{
                display: "grid",
                placeItems: "center",
                borderRight: `1.5px solid ${COLORS.ink}`,
                margin: "44px 0",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "scale(1)" : "scale(.85)",
                  transition: "opacity .9s ease, transform .9s cubic-bezier(.2,.9,.3,1)",
                }}
              >
                <OvionMark size={190} draw={drawn} />
                <div style={{ marginTop: 10, fontSize: 13, letterSpacing: 3, opacity: 0.85 }}>
                  ARCHITECTURE&nbsp;&middot;&nbsp;INTERIOR&nbsp;&middot;&nbsp;CONSTRUCTION
                </div>
              </div>
            </div>

            {/* right: details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 48px",
                gap: 18,
              }}
            >
              <div
                style={{
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity .6s ease .2s, transform .6s ease .2s",
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 38,
                    fontWeight: 600,
                    borderBottom: `2px solid ${COLORS.ink}`,
                    display: "inline-block",
                    paddingBottom: 2,
                    letterSpacing: 1,
                  }}
                >
                  ANAND SANTHANAM
                </div>
                <div style={{ fontSize: 15, letterSpacing: 4, marginTop: 6 }}>STUDIO HEAD</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                <ContactRow icon="✉" text="a6ovionarchitects@gmail.com" delay={0.5} show={drawn} />
                <ContactRow icon="◉" text="a6ovion_architects" delay={0.65} show={drawn} />
                <ContactRow icon="▶" text="A6 Ovion Architects" delay={0.8} show={drawn} />
                <ContactRow icon="✆" text="+91 89399 66556" delay={0.95} show={drawn} />
                <ContactRow
                  icon="⌖"
                  text="Shaaswath, 2/99, Appu Street, Mylapore, Chennai 600004"
                  delay={1.1}
                  show={drawn}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SLIDE 3: TAGLINE ---------------- */}
        {i === 2 && (
          <div style={{ textAlign: "center", zIndex: 1, padding: 40 }}>
            {["ARCHITECTURE", "INTERIOR", "CONSTRUCTION"].map((w, k) => (
              <div
                key={w}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(34px, 6vw, 64px)",
                  lineHeight: 1.1,
                  letterSpacing: 6,
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity .7s ease ${0.2 + k * 0.25}s, transform .7s cubic-bezier(.2,.9,.3,1) ${
                    0.2 + k * 0.25
                  }s`,
                }}
              >
                {w}
              </div>
            ))}
            <div
              style={{
                width: 80,
                height: 2,
                background: COLORS.ink,
                margin: "26px auto 0",
                opacity: drawn ? 1 : 0,
                transition: "opacity .8s ease 1.2s",
              }}
            />
            <div
              style={{
                marginTop: 16,
                fontSize: 14,
                letterSpacing: 5,
                opacity: drawn ? 0.85 : 0,
                transition: "opacity .8s ease 1.4s",
              }}
            >
              A6 OVION ARCHITECTS &nbsp;·&nbsp; CHENNAI
            </div>
          </div>
        )}

        {/* nav arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          style={navBtn("left")}
        >
          ‹
        </button>
        <button onClick={() => go(1)} aria-label="Next" style={navBtn("right")}>
          ›
        </button>

        {/* progress dots */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 10,
            zIndex: 2,
          }}
        >
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => {
                setI(k);
                setSeed((s) => s + 1);
              }}
              aria-label={`Go to slide ${k + 1}`}
              style={{
                width: k === i ? 26 : 9,
                height: 9,
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: k === i ? COLORS.ink : "rgba(20,17,14,.35)",
                transition: "all .4s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 13, letterSpacing: 2, opacity: 0.6 }}>
        Use ← → keys or click the arrows · auto-advances every 6s
      </div>
    </div>
  );
}

function navBtn(side) {
  return {
    position: "absolute",
    top: "50%",
    [side]: 12,
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: `1.5px solid ${COLORS.ink}`,
    background: "rgba(197,166,147,.5)",
    color: COLORS.ink,
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
    zIndex: 3,
    display: "grid",
    placeItems: "center",
    backdropFilter: "blur(2px)",
  };
}
