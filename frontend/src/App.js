import React from "react";
import ReactDOM from 'react-dom/client'
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
//import Navbar from "./components/navBar";
import Home from "./components/home";
 
const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
      /*<Navbar />*/
/*<Route path="/edit/:id" element={<EditJob />} />*/
export default App;