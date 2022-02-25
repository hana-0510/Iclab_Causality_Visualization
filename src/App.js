import React from 'react';
import MainPage from './Main';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import FooterJ from './footer';
import HeaderJ from './header';
import Tutorial from './tutorial';

function App() {

  return (
      <BrowserRouter>
        <HeaderJ />
          <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/tutorial" element={<Tutorial/>} />
          </Routes>
        <FooterJ />
      </BrowserRouter>
      
  );
}

export default App;
