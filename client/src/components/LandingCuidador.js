import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCalendarDays, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import CuidadorBottomBar from './CuidadorBottomBar';

const LandingCuidador = () => {
	const { isAuthenticated } = useContext(AuthContext);
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectFechasYHorarios = () => {
		navigate('/fechas-y-horarios');
	}
	
	const redirectMisContratos = () => {
		navigate('/mis-contratos');
	}

	const redirectProfile = () => {
		navigate('/account');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='relative h'>
					<CuidadorBottomBar />
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<h1 className='flex justify-center font-bold text-lg py-4'>
							Cuidar
						</h1>
					</div>
					<div className='space-y-5 p-7 my-2 mx-auto flex flex-col justify-center items-center'>
						<button
							className='w-full flex flex-row gap-4 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectFechasYHorarios(e) }}
						>
							<FontAwesomeIcon className='text-3xl' icon={faCalendarDays} />
							<p>Fechas y horarios disponibles</p>
						</button>
						<button
							className='w-full flex flex-row gap-4 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectMisContratos(e) }}
						>
							<FontAwesomeIcon className='text-3xl' icon={faList} />
							<p>Mis contratos</p>
						</button>
						<button
							className='w-full flex flex-row gap-4 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectProfile(e) }}
						>
							<FontAwesomeIcon className='text-3xl' icon={faUser} />
							<p>Mi perfil</p>
						</button>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default LandingCuidador;