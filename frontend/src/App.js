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
import SchedulePage from "./pages/schedulePage";
import AddEvent from "./pages/addEventPage";
import Layout from "./components/Layout";
import Login from "./pages/loginPage";
import RequireAuth from "./components/RequireAuth";
import Logout from "./components/Logout";

 
const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="" element={<Layout />}>
          {/* PUBLIC */}
          <Route exact path="/" element={<Home />} /> {/* Home page with player list */}
          <Route path="/score" element={<Leaderboard />} /> {/* Overall leaderboard for the RI */}
          <Route path="/:id" element={<Description />} /> {/* Main profile page for player */}
          <Route path="/schedule" element={<SchedulePage />}/> {/* Schedule Page */}
          <Route path="/login" element={<Login />}/> {/* Login Page (Admin only for now) */}
          <Route path="/logout" element={<Logout />}/> {/* Logout Function */}

          <Route path="/league/:id" element={<LeagueProfilePage />} /> {/* League of Legends focused profile page for player */}
          <Route path="/league" element={<LeaguePage />} /> {/* Details regarding RI League of Legends rules, scoring, and highlights */}
          <Route path="/league/games/:id" element={<LeagueGamePage />} /> {/* Game stats with listed individual player stats for a League of Legends game */}

          <Route path="/brawl/:id" element={<BrawlProfilePage/>}/> {/* Brawlhalla focused profile page for player */}
          <Route path="/brawl" element={<BrawlPage />}/> {/* Details regarding RI Brawlhalla rules, scoring, and highlights */}
          <Route path="/brawl/ones" element={<BrawlOnesPage />}/> {/* Brawlhalla ones games and stats */}
          <Route path="/brawl/twos" element={<BrawlTwosPage />}/> {/* Brawlhalla twos games and stats */}

          {/* PROTECTED */}
          <Route element={<RequireAuth allowedRoles={['Admin']}/>}>
            <Route path="/add" element={<Add />} /> {/* Allows for for new default profile additions */}
            <Route path="/edit/:id" element={<Edit />} /> {/* Allows for updates to a player's default profile */}
            <Route path="/schedule/add" element={<AddEvent />}/> {/* Add Event Page */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
};
export default App;