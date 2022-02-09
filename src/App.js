import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter, HashRouter, Navigate, Redirect, Route, Routes } from 'react-router-dom';
import './App.css';
import DailyView from './components/DailyView';
import EditEntry from './components/EditEntry';
import EntryDetails from './components/EntryDetails';
import DateContext from './DateContext';
import Login from './components/Login'
import UserContext from './UserContext';
import Navbar from './components/Navbar';

function App() {
  const [selectedDate, setDate] = useState(new Date());
  const [username, setUsername] = useState("");
  useEffect(() => {
  }, []);

  if (username === undefined || username.length < 1) { // user not logged in: redirect to login screen
    return (
      <div>
        <h1 className="text-center"> Time Reporting System</h1>
        <UserContext.Provider value={{ username, setUsername }}>
          <DateContext.Provider value={{ selectedDate, setDate }}>
            <HashRouter>
              <Routes>
                <Route path="/Login" element={<Login setUsername={setUsername} />} />
                <Route path="*" element={<Navigate to="/Login" />} />
              </Routes>
            </HashRouter>
          </DateContext.Provider>
        </UserContext.Provider>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-center"> Time Reporting System</h1>
      <UserContext.Provider value={{ username, setUsername }}>
        <DateContext.Provider value={{ selectedDate, setDate }}>
          <Navbar/>
          <HashRouter>
            <Routes>
              <Route path="/Login" element={<Login />} />
              <Route path="/DailyView/:date" element={<DailyView date={selectedDate} />} />
              <Route path="/AddEntry/:date" element={<EditEntry date={selectedDate} />} />
              <Route path="/EditEntry/:date/:id" element={<EditEntry date={selectedDate} />} />
              <Route path="/DetailsEntry/:date/:id" element={<EntryDetails date={selectedDate} mode="details" />} />
              <Route path="/DeleteEntry/:date/:id" element={<EntryDetails date={selectedDate} mode="delete" />} />
            </Routes>
          </HashRouter>
        </DateContext.Provider>
      </UserContext.Provider>
    </div>
  );
}
export default App;