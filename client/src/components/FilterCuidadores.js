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
				<form className='space-y-5 p-10 my-20 mx-auto flex flex-col justify-start items-center bg-gray-100 min-w-70 w-96 rounded-md bg-slate-200z'>
					<h1>Buscar cuidadores</h1>
					<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Por puntaje de los usuarios
					</label>
					<div className='flex flex-row space-x-4 items-start w-full'>
						<input
							type="checkbox"
							name="fantastico"
							className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
							placeholder=""
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Fantastico: 9+
						</label>
					</div>
					<div className='flex flex-row space-x-4 items-start w-full'>
						<input
							type="checkbox"
							name="muy_bueno"
							className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
							placeholder=""
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Muy bueno: 8+
						</label>
					</div>
					<div className='flex flex-row space-x-4 items-start w-full'>
						<input
							type="checkbox"
							name="bueno"
							className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
							placeholder=""
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Bueno: 7+
						</label>
					</div>
					<div className='flex flex-row space-x-4 items-start w-full'>
						<input
							type="checkbox"
							name="satisfactorio"
							className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
							placeholder=""
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
						<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Satisfactorio: 6+
						</label>
					</div>
					<button 
						type="submit"
						className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						onClick={ (e) => { searchCuidadores(e) }}
					>
						Buscar
					</button>
				</form>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FilterCuidadores;