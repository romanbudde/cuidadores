import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

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
			checkboxes_reviews: checkboxesReviews
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
					<div className='flex flex-row space-x-4 items-center w-full'>
						<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Tarifa minima
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
					<div className='flex flex-row space-x-4 items-center w-full'>
						<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
							Tarifa maxima
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
				</form>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FilterCuidadores;