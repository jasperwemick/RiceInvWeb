import React from "react";
import ReactDOM from 'react-dom/client'
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Home from "./pages/homePage";
import Add from "./pages/addProfilePage";
import Edit from "./pages/editProfilePage";
import Leaderboard from "./components/leaderboard";
import Description from "./pages/profilePage";
import LeagueProfilePage from "./pages/leagueProfilePage";
import LeaguePage from "./pages/leagueHomePage";
import LeagueGamePage from "./pages/leagueGamePage";
import BrawlProfilePage from "./pages/brawlProfilePage";
import BrawlPage from "./pages/brawlHomePage";
import BrawlOnesPage from "./pages/brawlOnesPage";
import BrawlTwosPage from "./pages/brawlTwosPage";
 
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

        {/* Brawlhalla focused profile page for player */}
        <Route path="/brawl/:id" element={<BrawlProfilePage/>}/>

        {/* Details regarding RI Brawlhalla rules, scoring, and highlights */}
        <Route path="/brawl" element={<BrawlPage />}/>

        {/* Brawlhalla ones games and stats */}
        <Route path="/brawl/ones" element={<BrawlOnesPage />}/> 

        {/* Brawlhalla twos games and stats */}
        <Route path="/brawl/twos" element={<BrawlTwosPage />}/> 
      </Routes>
    </div>
  );
};
export default App;