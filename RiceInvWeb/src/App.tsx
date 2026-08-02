import { Switch, Route } from "wouter";

import Navbar from "./components/Navbar";
import Home from "./pages/homePage";
import Add from "./pages/addProfilePage";
import Edit from "./pages/editProfilePage";
import Leaderboard from "./components/Leaderboard";
import Description from "./pages/profilePage";
import LeagueProfilePage from "./pages/leagueProfilePage";
import LeaguePage from "./pages/leagueHomePage";
import LeagueGamePage from "./pages/leagueGamePage";
import BrawlProfilePage from "./pages/brawlProfilePage";
import BrawlOnesPage from "./pages/brawlOnesPage";
import BrawlTwosPage from "./pages/brawlTwosPage";
import Layout from "./components/Layout";
import { Login } from "./components/Login";
import RequireAuth from "./components/RequireAuth";
import Logout from "./components/Logout";
import BlastHomePage from "./pages/blastHomePage";
import BlastJeopardyPage from "./pages/blastJeopardyPage";
import BlastAmongusPage from "./pages/blastAmongusPage";
import Alert from "./components/Alert";
import { AlertProvider } from "./context/AlertProvider";
import { ProfileContextProvider } from "./components/Profile/context/ProfileContextProvider";

import './style/global.css'
import SchedulePage from "./components/Schedule/schedulePage";
import { Account } from "./components/Account";
import RankingsPage from "./pages/rankingsPage/RankingsPage";
 
const App = () => {
  return (
    <div>
      <Navbar/>
      <AlertProvider>
      <ProfileContextProvider>
        <Alert/>
        <Layout>
          <Switch>
            {/* PUBLIC */}
            <Route path="/" component={Home} /> {/* Home page with player list */}
            <Route path="/score" component={Leaderboard} /> {/* Overall leaderboard for the RI */}
            <Route path="/:id" component={Description} /> {/* Main profile page for player */}
            <Route path="/schedule" component={SchedulePage}/> {/* Schedule Page */}
            <Route path="/login" component={Login}/> {/* Login Page (Admin only for now) */}
            <Route path="/logout" component={Logout}/> {/* Logout Function */}

            <Route path="/league/:id" component={LeagueProfilePage} /> {/* League of Legends focused profile page for player */}
            <Route path="/league" component={LeaguePage} /> {/* Details regarding RI League of Legends rules, scoring, and highlights */}
            <Route path="/league/games/:num" component={LeagueGamePage} /> {/* Game stats with listed individual player stats for a League of Legends game */}

            <Route path="/brawl/:id" component={BrawlProfilePage}/> {/* Brawlhalla focused profile page for player */}
            <Route path="/brawl" component={RankingsPage}/> {/* Details regarding RI Brawlhalla rules, scoring, and highlights */}
            <Route path="/brawl/ones" component={BrawlOnesPage}/> {/* Brawlhalla ones games and stats */}
            <Route path="/brawl/twos" component={BrawlTwosPage}/> {/* Brawlhalla twos games and stats */}

            <Route path="/blast" component={BlastHomePage}/> {/* Bullshit Blast Page */}
            <Route path="/blast/jeopardy" component={BlastJeopardyPage}/> {/* Bullshit Blast Jeopardy Page */}
            <Route path="/blast/amongus" component={BlastAmongusPage}/> {/* Bullshit Blast Among Us Page */}

            {/* PROTECTED */}
            <Route>
              <RequireAuth allowedRoles={['Visitor']}>
                <Route path="/account" component={Account} /> {/* Account info for user */}
              </RequireAuth>
            </Route>
            <Route>
              <RequireAuth allowedRoles={['Admin']}>
                <Route path="/add" component={Add} /> {/* Allows for for new default profile additions */}
                <Route path="/edit/:id" component={Edit} /> {/* Allows for updates to a player's default profile */}
              </RequireAuth>
            </Route>
          </Switch>
        </Layout>
      </ProfileContextProvider>
      </AlertProvider>
    </div>
  );
};
export default App;
