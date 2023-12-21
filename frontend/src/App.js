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
import Description from "./components/profilePage";
import LeagueProfilePage from "./components/leagueProfilePage";
import LeaguePage from "./components/leaguePage";
import LeagueGamePage from "./components/leagueGamePage";
 
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Home page with player list */}
        <Route exact path="/" element={<Home />} />

        {/* Allows for for new default profile additions */}
        <Route path="/add" element={<Add />} />

        {/* Allows for updates to a player's default profile */}
        <Route path="/edit/:id" element={<Edit />} />

        {/* Overall leaderboard for the RI */}
        <Route path="/score" element={<Leaderboard />} />

        {/* Main profile page for player */}
        <Route path="/:id" element={<Description />} />

        {/* League of Legends focused profile page for player */}
        <Route path="/league/:id" element={<LeagueProfilePage />} />

        {/* Details regarding RI League of Legends rules, scoring, and highlights */}
        <Route path="/league" element={<LeaguePage />} /> 
        
        {/* Game stats with listed individual player stats for a League of Legends game */}
        <Route path="/league/games/:id" element={<LeagueGamePage />} />
      </Routes>
    </div>
  );
};
export default App;