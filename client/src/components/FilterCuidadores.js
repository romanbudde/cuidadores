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
import Paginate from './Paginate';
import MoonLoader from "react-spinners/ClipLoader";

const FilterCuidadores = () => {

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
	const [displayedCuidadores, setDisplayedCuidadores] = useState([]);
	const [showDisponibilidadModal, setShowDisponibilidadModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedCuidadores.slice(indexOfFirstPost, indexOfLastPost);
    
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

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

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
		setLoading(true);
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
			(process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `search_cuidadores/`,
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
		setDisplayedCuidadores(response);
		setLoading(false);
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


				<Paginate
					postsPerPage={postsPerPage}
					totalPosts={displayedCuidadores.length}
					paginate={paginate}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
				/>
				{currentPosts.length > 0 && (
					<>
						<div className='mx-5 my-7 border border-gray-300'>
						</div>
						<div className='flex flex-col space-y-7 mx-auto items-center rounded-md justify-start w-96 mb-28'>
							<h1 className='flex justify-center font-bold text-md'>{cuidadores.length} Cuidadores encontrados:</h1>
							{currentPosts.map(cuidador => (
								<div 
									className='bg-gray-300 p-4 rounded-md shadow-lg'
									key={cuidador.id}
								>
									<h2 className='flex flex-row gap-1'><p className='font-semibold'>Cuidador:</p> {cuidador.name}</h2>
									<h2 className='flex flex-row gap-1'><p className='font-semibold'>Tarifa por hora:</p> {cuidador.hourly_rate}</h2>
									<h2 className='flex flex-row gap-1'><p className='font-semibold'>Puntaje promedio de reseñas:</p> {cuidador.average_review_score}</h2>
									<button
										className='w-full mt-7 text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
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
					</>
				)}
				{loading && (
					<div className='bg-gray-800 fixed inset-0 opacity-95 z-50 flex flex-row justify-center items-center'>
						<MoonLoader
							color="#36d7b7"
							size={60}
							loading={true}
							speedMultiplier={0.7}
						/>
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