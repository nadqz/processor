// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Compress from "./routes/Compress";
import Convert from "./routes/Convert";
import Crop from "./routes/Crop";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Compress />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/crop" element={<Crop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
