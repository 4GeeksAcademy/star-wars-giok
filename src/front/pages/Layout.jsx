// src/front/pages/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const BackgroundVideo = ({ src = "/fondo.mp4" }) => (
  <div className="bg-video" aria-hidden="true">
    <video className="bg-video__media" autoPlay loop muted playsInline preload="metadata">
      <source src={src} type="video/mp4" />
    </video>
    <div className="bg-video__overlay" />
  </div>
);

export const Layout = () => {
  return (
    <>
      {/* Video de fondo global */}
      <BackgroundVideo src="/fondo.mp4" />

      <ScrollToTop>
        {/* Shell para sticky footer */}
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ScrollToTop>
    </>
  );
};
