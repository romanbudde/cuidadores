import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const ListUsers = () => {
	const { isAuthenticated } = useContext(AuthContext);
    
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

	const redirectVerMisContratos = () => {
		navigate('/mis-contratos');
	}

	const redirectProfile = () => {
		navigate('/account');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='space-y-5 p-10 my-20 mx-auto flex flex-col justify-center items-center bg-gray-100 min-w-70 w-96 rounded-md bg-slate-200z'>
					<h1>User landing page</h1>
					<button
						className='w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						onClick={ (e) => { redirectBuscarCuidadores(e) }}
					>
						Buscar cuidadores
					</button>
					<button
						className='w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						onClick={ (e) => { redirectVerMisContratos(e) }}
					>
						Ver mis contratos
					</button>
					<button
						className='w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						onClick={ (e) => { redirectProfile(e) }}
					>
						Mi perfil
					</button>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default ListUsers;