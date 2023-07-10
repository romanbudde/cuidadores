import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

import useWebSocket from 'react-use-websocket';

import VerDisponibilidad from './VerDisponibilidad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';

const FilterCuidadores = () => {

	// const WS_URL = 'ws://localhost:5000/';
	
	// const socket = new WebSocket('ws://localhost:5000');
	
	// const testingWebsocket = useWebSocket(WS_URL, {
	// 	onOpen: () => {
	// 	  console.log('WebSocket connection established.');
	// 	}
	// });

	const { isAuthenticated } = useContext(AuthContext);
	const [search, setSearch] = useState('');
	const [tarifaMinima, setTarifaMinima] = useState('');
	const [tarifaMaxima, setTarifaMaxima] = useState('');
	const [checkboxesReviews, setCheckboxesReviews] = useState({
		satisfactorio: false,
		bueno: false,
		muybueno: false,
		fantastico: false
	});
	const [cuidadores, setCuidadores] = useState([]);
	const [showDisponibilidadModal, setShowDisponibilidadModal] = useState(false);
    
	const handleCheckboxReviewsChange = (event) => {
		const { name, checked } = event.target;
		setCheckboxesReviews(prevState => ({
			...prevState,
			[name]: checked
		}));
	};

	const navigate = useNavigate();
	const cookies = new Cookies();

	// console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		navigate('/landing');
	}

	// const handleShowDisponibilidadModal = (cuidador) => setShowDisponibilidadModal(true);

	const handleShowDisponibilidadModal = (cuidador) => () => {
		// Use cuidador inside this function
		console.log('Clicked on:', cuidador);
		setShowDisponibilidadModal(cuidador);
	  };

    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowDisponibilidadModal(false);
    }

	const redirectBuscarCuidadores = () => {
		navigate('/filter-cuidadores');
	}

	const searchCuidadores = async (e) => {
		e.preventDefault();

		let lowestScoreAcceptable = 0;
		// get the mininum review score to filter by.
		if(checkboxesReviews['fantastico']){
			lowestScoreAcceptable = 9;
		}
		if(checkboxesReviews['muybueno']){
			lowestScoreAcceptable = 8;
		}
		if(checkboxesReviews['bueno']){
			lowestScoreAcceptable = 7;
		}
		if(checkboxesReviews['satisfactorio']){
			lowestScoreAcceptable = 6;
		}
		console.log('lowest review score acceptable: ', lowestScoreAcceptable);

		let bodyJSON = { 
			min_rate: tarifaMinima, 
			max_rate: tarifaMaxima,
			lowest_score_acceptable: lowestScoreAcceptable
		};
		const response = await fetch(
			"http://localhost:5000/search_cuidadores/",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(bodyJSON)
			}
		).then(response => response.json());

		console.log('response of searching for cuidadores: ');
		console.log(response);
		setCuidadores(response);
	}
	console.log('cuidadores: ', cuidadores.length)
	// console.log(cuidadores)

	if(isAuthenticated){
		return (
			<Fragment>
				<form className='rounded-md bg-slate-200z'>
					<ClientBottomBar />
					<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Buscar cuidadores</h1>
					</div>
					<div className='space-y-5 px-10 py-4 mx-auto flex flex-col justify-start'>
						<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
							Por puntaje de los usuarios
						</label>
						<div className='flex flex-row space-x-4 items-start w-full'>
							<input
								type="checkbox"
								name="fantastico"
								checked={checkboxesReviews.fantastico}
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								onChange={handleCheckboxReviewsChange}
							/>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Fantastico: 9+
							</label>
						</div>
						<div className='flex flex-row space-x-4 items-start w-full'>
							<input
								type="checkbox"
								name="muybueno"
								checked={checkboxesReviews.muybueno}
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								onChange={handleCheckboxReviewsChange}
							/>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Muy bueno: 8+
							</label>
						</div>
						<div className='flex flex-row space-x-4 items-start w-full'>
							<input
								type="checkbox"
								name="bueno"
								checked={checkboxesReviews.bueno}
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								onChange={handleCheckboxReviewsChange}
							/>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Bueno: 7+
							</label>
						</div>
						<div className='flex flex-row space-x-4 items-start w-full'>
							<input
								type="checkbox"
								name="satisfactorio"
								checked={checkboxesReviews.satisfactorio}
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								onChange={handleCheckboxReviewsChange}
							/>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Satisfactorio: 6+
							</label>
						</div>
						<div className='flex flex-col items-start space-y-2 w-full'>
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Tarifa minima (por media hora)
							</label>
							<input
								type="text"
								name="satisfactorio"
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								value={tarifaMinima}
								onChange={e => setTarifaMinima(e.target.value)}
							/>
						</div>
						<div className='flex flex-col items-start space-y-2 w-full'>
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
								Tarifa maxima (por media hora)
							</label>
							<input
								type="text"
								name="tarifa_maxima"
								className="bg-gray-50 border text-gray-900 text-sm focus:ring-gray-600 focus:border-gray-200 block p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
								placeholder=""
								value={tarifaMaxima}
								onChange={e => setTarifaMaxima(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={ (e) => { searchCuidadores(e) }}
						>
							Buscar
						</button>

					</div>
				</form>
				{
					console.log('cuidadores length: ', cuidadores.length)
				}
				{ cuidadores.length > 0 && (
					<div className='flex flex-col space-y-4 mx-auto items-center rounded-md justify-start w-96 py-2 my-5 border-t-2 border-t-gray-200 mb-28'>
						<h1 className='flex justify-center font-bold text-md py-4'>{cuidadores.length} Cuidadores encontrados:</h1>
						{cuidadores.length > 0 && cuidadores.map(cuidador => (
							<div 
								className='bg-gray-200 p-4 rounded-md'
								key={cuidador.id}
							>
								<h2>Cuidador: {cuidador.name}</h2>
								<h2>Hourly rate: ${cuidador.hourly_rate}</h2>
								<h2>Average review score: {cuidador.average_review_score}</h2>
								<button
									className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
									onClick={handleShowDisponibilidadModal(cuidador)}
								>
									Ver disponibilidad
								</button>
								<VerDisponibilidad
									cuidador={cuidador}
									show={showDisponibilidadModal === cuidador}
									onClose={handleClose}
								/>
							</div>
						))}
					</div>
				)}
				{ cuidadores.length <= 0 && (
					<div className='flex flex-col space-y-4 mx-auto items-center rounded-md justify-start w-96 py-2 my-5 border-t-2 border-t-gray-200'>
						<h1 className='flex justify-center font-bold text-md py-4'>{cuidadores.length} Cuidadores encontrados</h1>
						
					</div>
				)}
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FilterCuidadores;