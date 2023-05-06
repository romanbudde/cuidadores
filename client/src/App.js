import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Routes, Navigate } from "react-router-dom";
import HomePage from './routes/HomePage';
import UsersListPage from './routes/UsersListPage';
import UserLandingPage from './routes/UserLandingPage';
import RegisterPage from './routes/RegisterPage';
import FilterCuidadoresPage from './routes/FilterCuidadoresPage';
import { AuthProvider, AuthContext } from './components/AuthContext';

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
	<AuthProvider>
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
				path="/register"
				element={
					<>
					{ <RegisterPage />}
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
				<Route 
				path="/landing"
				element={
					<>
					{ <UserLandingPage /> }
					</>
				} 
				/>
				<Route 
				path="/filter-cuidadores"
				element={
					<>
					{ <FilterCuidadoresPage /> }
					</>
				} 
				/>
			</Routes>
		</Router>
	</AuthProvider>
  </div>
}

export default App;
