import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const FilterCuidadores = () => {
	
	const { isAuthenticated } = useContext(AuthContext);
	const [search, setSearch] = useState('');
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectBuscarCuidadores = () => {
		navigate('/filter-cuidadores');
	}

	const searchCuidadores = () => {
		
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='space-y-5 p-10 my-20 mx-auto flex flex-col justify-center items-center bg-gray-100 min-w-70 w-96 rounded-md bg-slate-200z'>
					<h1>Buscar cuidadores</h1>
					<input
						type="email"
						name="search"
						className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
						placeholder=""
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<button 
						type="submit"
						className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						onClick={ (e) => { searchCuidadores(e) }}
					>
						Buscar
					</button>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FilterCuidadores;