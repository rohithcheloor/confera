import LandingPage from "../pages/LandingPage";
import SetUpPage from "../pages/SetUpPage";
import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";


function App() {
  return (
    // <div className="App">
    //   <LandingPage />
    //   <SetUpPage/>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}> </Route>
        <Route path="/setup" element={<SetUpPage/>}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
