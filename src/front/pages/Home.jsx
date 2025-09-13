import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
    <div className="home-container">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="home-video"
      >
        <source src="/fondo.mp4" type="video/mp4" />
        Tu navegador no soporta video en HTML5.
      </video>

      {/* Contenido encima del video */}
      <div className="home-overlay">
        <h1 className="home-title">Bienvenido</h1>
        <p className="home-subtitle">Aquí comienza tu proyecto 🚀</p>
      </div>
    </div>
  );
};