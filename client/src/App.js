import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";
import HomePage from './routes/HomePage';
import UsersListPage from './routes/UsersListPage';

import './App.css';

// components
import AddUser from './components/AddUser';
import ListUsers from './components/ListUsers';
import User from "./components/User";

const App = () => {
  // return (
  //   <Fragment>
  //       <ListUsers />
  //   </Fragment>
  // );
  return <div>
    <Router>
      <Routes>
        <Route 
          path="/"
          element={
            <>
              { <HomePage />}
            </>
          } 
        />
        <Route 
          path="/users"
          element={
            <>
              { <UsersListPage /> }
            </>
          } 
        />
      </Routes>
    </Router>
  </div>
}

export default App;
