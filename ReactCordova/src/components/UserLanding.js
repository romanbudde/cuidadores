import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faMagnifyingGlass, faFolderOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
// import { faHouse as heartSolido } from '@fortawesome/free-regular-svg-icons'

const UserLanding = () => {
	const { isAuthenticated } = useContext(AuthContext);
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		navigate('/landing');
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
				<div className='relative h'>
					<ClientBottomBar />

					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<h1 className='flex justify-center font-bold text-lg py-4'>
							CuidadorApp
						</h1>
					</div>
					<div className='space-y-5 p-10 my-2 mx-auto flex flex-col justify-center items-center'>
						<button
							className='flex flex-row items-center gap-5 justify-start pl-10 w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-5 text-center'
							onClick={ (e) => { redirectBuscarCuidadores(e) }}
						>
							<FontAwesomeIcon className='text-3xl' icon={faMagnifyingGlass} />
							Buscar cuidadores
						</button>
						<button
							className='flex flex-row items-center gap-5 justify-start pl-10 w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-5 text-center'
							onClick={ (e) => { redirectVerMisContratos(e) }}
						>
							<FontAwesomeIcon className='text-3xl' icon={faFolderOpen} />
							Ver mis contratos
						</button>
						<button
							className='flex flex-row items-center gap-5 justify-start pl-10 w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-md px-5 py-5 text-center'
							onClick={ (e) => { redirectProfile(e) }}
						>
							<FontAwesomeIcon className='text-3xl mr-2' icon={faUser} />
							Mi perfil
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

export default UserLanding;