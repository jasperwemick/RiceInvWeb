import React from "react";
import ReactDOM from 'react-dom/client'
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Home from "./components/home";
import Add from "./components/addProfile";
import Edit from "./components/editProfile";
import Leaderboard from "./components/leaderboard";
 
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/score" element={<Leaderboard />} />
      </Routes>
    </div>
  );
};
      /*<Navbar />*/
export default App;