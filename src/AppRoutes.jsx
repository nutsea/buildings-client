import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Object from "./pages/Object";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element = { <Main /> } />
            <Route path="/object/:id" element = { <Object /> } />
        </Routes>
    );
}
 
export default AppRoutes;