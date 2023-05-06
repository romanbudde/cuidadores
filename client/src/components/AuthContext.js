// AuthContext.js
import { createContext, useState } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	console.log('cookie, auth token: ');
	console.log(cookies.get('auth-token')); // Pacman
	const [isAuthenticated, setIsAuthenticated] = useState(
		Boolean(cookies.get('auth-token'))
	);

	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
		{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };