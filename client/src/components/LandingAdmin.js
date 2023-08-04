import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faGear, faUserGroup, faUser, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import CuidadorBottomBar from './CuidadorBottomBar';

const LandingAdmin = () => {
	const { isAuthenticated } = useContext(AuthContext);
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectProfile = () => {
		navigate('/account');
	}
	
	const redirectUsuarios = () => {
		navigate('/users');
	}

	const redirectContratos = () => {
		navigate('/contracts');
	}

	const redirectMercadoPagoConfig = () => {
		navigate('/mercadopago-config');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='relative h'>
					<CuidadorBottomBar />
					<div className='flex flex-col items-center justify-center relative border-b-2 border-b-gray-200'>
						<h1 className='flex justify-center font-bold text-lg pt-4 pb-1'>
							Cuidar
						</h1>
						<p className='text-md text-gray-600'>Panel de Administrador</p>
					</div>
					<div className='space-y-5 p-7 my-2 mx-auto flex flex-col justify-center items-center'>
						<button
							className='w-full flex flex-row gap-5 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center'
							onClick={ (e) => { redirectContratos(e) }}
						>
							<FontAwesomeIcon icon={faFolderOpen} className='text-3xl mr-1'/>
							Contratos
						</button>
						<button
							className='w-full flex flex-row gap-5 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center'
							onClick={ (e) => { redirectUsuarios(e) }}
						>
							<FontAwesomeIcon icon={faUserGroup} className='text-3xl'/>
							Usuarios
						</button>
						<button
							className='w-full flex flex-row gap-5 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center'
							onClick={ (e) => { redirectProfile(e) }}
						>
							<FontAwesomeIcon icon={faUser} className='text-3xl mr-3'/>
							Mi perfil
						</button>
						<button
							className='w-full flex flex-row gap-5 items-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-5 text-center'
							onClick={ (e) => { redirectMercadoPagoConfig(e) }}
						>
							<FontAwesomeIcon icon={faGear} className='text-3xl mr-2'/>
							<p className='text-md font-semibold'>Configuración Mercado Pago</p>
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

export default LandingAdmin;