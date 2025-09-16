// src/front/routes.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { People } from "./pages/People";
import { Planets } from "./pages/Planets";
import { Vehicles } from "./pages/Vehicles";
import { Favorites } from "./pages/Favorites";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { PeopleDetail } from "./pages/PeopleDetail";
import { PlanetDetail } from "./pages/PlanetDetail";
import { VehicleDetail } from "./pages/VehicleDetail";
import { Register } from "./pages/Register";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="people" element={<People />} />
      <Route path="planets" element={<Planets />} />
      <Route path="vehicles" element={<Vehicles />} />
      <Route path="favorites" element={<Favorites />} />
       <Route path="people/:id" element={<PeopleDetail />} />
      <Route path="planets/:id" element={<PlanetDetail />} />
      <Route path="vehicles/:id" element={<VehicleDetail />} />
      <Route path="register" element={<Register />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
    </Route>
  )
);
