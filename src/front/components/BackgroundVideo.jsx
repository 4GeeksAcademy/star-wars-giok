import React from "react";

export const BackgroundVideo = ({ src = "/fondo.mp4", poster = "" }) => {
  return (
    <div className="bg-video" aria-hidden="true">
      <video
        className="bg-video__media"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster || undefined}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* Capa sutil para mejorar contraste de textos */}
      <div className="bg-video__overlay" />
    </div>
  );
};
