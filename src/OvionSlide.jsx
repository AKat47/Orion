import React, { useState, useEffect, useCallback, useRef } from "react";

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
function OvionMark({ size = 240, draw, style: extraStyle }) {
  const dash = 720;
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{ maxWidth: "100%", ...extraStyle }} aria-label="Ovion Architects logo">
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
        gap: 14,
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`,
      }}
    >
      <span
        style={{
          fontSize: 16,
          width: 30,
          height: 30,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          border: `1.5px solid ${COLORS.ink}`,
          borderRadius: "50%",
        }}
      >
        {icon}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: "clamp(11px, 1.4vw, 15px)", letterSpacing: 0.5, lineHeight: 1.35 }}>
        {text}
      </span>
    </div>
  );
}

export default function OvionSlide() {
  const slides = ["logo", "card", "tag"];
  const [i, setI] = useState(0);
  const [seed, setSeed] = useState(0);
  const [fading, setFading] = useState(false);
  const touchStart = useRef(null);

  const go = useCallback(
    (n) => {
      setFading(true);
      setTimeout(() => {
        setI((prev) => (prev + n + slides.length) % slides.length);
        setSeed((s) => s + 1);
        setFading(false);
      }, 400);
    },
    [slides.length]
  );

  // auto-advance every 7s
  useEffect(() => {
    const t = setTimeout(() => go(1), 7000);
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

  // touch swipe
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

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
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-2%,1%)} }
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .slide-stage { touch-action: pan-y; }

        /* mobile card layout */
        @media (max-width: 600px) {
          .slide-stage { aspect-ratio: auto !important; min-height: 85vw; }
          .card-grid { grid-template-columns: 1fr !important; }
          .card-left { display: none !important; }
          .card-right { padding: 20px 24px !important; gap: 12px !important; justify-content: center !important; }
        }
        @media (max-width: 380px) {
          .card-right { padding: 10px 14px 16px !important; }
        }
      `}</style>

      {/* slide stage */}
      <div
        className="slide-stage"
        style={{
          width: "min(940px, 100%)",
          position: "relative",
          background: COLORS.bg,
          borderRadius: 8,
          boxShadow: "0 40px 90px -30px rgba(20,17,14,.55)",
          overflow: "hidden",
          /* responsive: 16:9 on large, taller on mobile */
          aspectRatio: "16 / 9",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* subtle grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(20,17,14,.05) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.5,
            pointerEvents: "none",
            animation: "grain 8s ease-in-out infinite",
          }}
        />

        {/* slide content wrapper — fades on transition */}
        <div
          key={seed}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          {/* ---------------- SLIDE 1: LOGO ---------------- */}
          {i === 0 && (
            <div style={{ display: "grid", placeItems: "center", gap: 8, zIndex: 1 }}>
              <OvionMark size={300} draw={drawn} style={{ width: "min(300px, 55vw)", height: "auto" }} />
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(14px, 2.8vw, 26px)",
                  letterSpacing: "clamp(6px, 1.4vw, 14px)",
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
              className="card-grid"
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1.15fr",
                zIndex: 1,
                overflowY: "auto",
              }}
            >
              {/* left: mark */}
              <div
                className="card-left"
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
                  <OvionMark
                    size={190}
                    draw={drawn}
                    style={{ width: "min(190px, 38vw)", height: "auto" }}
                  />
                  <div style={{ marginTop: 10, fontSize: "clamp(9px, 1.2vw, 13px)", letterSpacing: 3, opacity: 0.85 }}>
                    ARCHITECTURE&nbsp;&middot;&nbsp;INTERIOR&nbsp;&middot;&nbsp;CONSTRUCTION
                  </div>
                </div>
              </div>

              {/* right: details */}
              <div
                className="card-right"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 clamp(20px, 4vw, 48px)",
                  gap: 14,
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
                      fontSize: "clamp(20px, 3.6vw, 38px)",
                      fontWeight: 600,
                      borderBottom: `2px solid ${COLORS.ink}`,
                      display: "inline-block",
                      paddingBottom: 2,
                      letterSpacing: 1,
                    }}
                  >
                    ANAND SANTHANAM
                  </div>
                  <div style={{ fontSize: "clamp(10px, 1.4vw, 15px)", letterSpacing: 4, marginTop: 6 }}>STUDIO HEAD</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
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
            <div style={{ textAlign: "center", zIndex: 1, padding: "clamp(20px, 5vw, 40px)" }}>
              {["ARCHITECTURE", "INTERIOR", "CONSTRUCTION"].map((w, k) => (
                <div
                  key={w}
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: "clamp(28px, 6vw, 64px)",
                    lineHeight: 1.1,
                    letterSpacing: "clamp(3px, 0.8vw, 6px)",
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(28px)",
                    transition: `opacity .7s ease ${0.2 + k * 0.25}s, transform .7s cubic-bezier(.2,.9,.3,1) ${0.2 + k * 0.25}s`,
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
                  margin: "clamp(16px,3vw,26px) auto 0",
                  opacity: drawn ? 1 : 0,
                  transition: "opacity .8s ease 1.2s",
                }}
              />
              <div
                style={{
                  marginTop: 14,
                  fontSize: "clamp(10px, 1.4vw, 14px)",
                  letterSpacing: "clamp(2px, 0.6vw, 5px)",
                  opacity: drawn ? 0.85 : 0,
                  transition: "opacity .8s ease 1.4s",
                }}
              >
                A6 OVION ARCHITECTS &nbsp;·&nbsp; CHENNAI
              </div>
            </div>
          )}
        </div>

        {/* progress bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(20,17,14,.12)",
            zIndex: 10,
          }}
        >
          <div
            key={`bar-${seed}`}
            style={{
              height: "100%",
              background: COLORS.ink,
              transformOrigin: "left",
              animation: "progressBar 7s linear forwards",
            }}
          />
        </div>

        {/* progress dots — indicator only, no click */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {slides.map((_, k) => (
            <div
              key={k}
              style={{
                width: k === i ? 24 : 8,
                height: 8,
                borderRadius: 8,
                background: k === i ? COLORS.ink : "rgba(20,17,14,.35)",
                transition: "all .4s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, letterSpacing: 2, opacity: 0.5 }}>
        SWIPE OR USE ← → · AUTO-ADVANCES
      </div>
    </div>
  );
}
