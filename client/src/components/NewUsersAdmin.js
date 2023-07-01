import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Datepicker from "react-tailwindcss-datepicker";
import '../css/datepicker.css';
import dayjs from 'dayjs';
import moment from 'moment';
import ClientBottomBar from './ClientBottomBar';
import Paginate from './Paginate';
import Select from 'react-select';

const NewUsersAdmin = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const { isAuthenticated, userId } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [userFirstname, setUserFirstname] = useState('');
    const [userLastname, setUserLastname] = useState('');
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);
    const [dateFilter, setDateFilter] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updateStatusFilter, setUpdateStatusFilter] = useState('all');
    const [updateStatusSearch, setUpdateStatusSearch] = useState('all');
    const [statusSearch, setStatusSearch] = useState('all');
    const [userEmail, setUserEmail] = useState('');
    const [noUsersWithThatStatusMessage, setNoUsersWithThatStatusMessage] = useState('');
	const [selectedDatesInterval, setSelectedDatesInterval] = useState({});
    const [user, setUser] = useState([]);
	
	// -- Pagination
    // const [displayedContracts, setDisplayedContracts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedUsers.slice(indexOfFirstPost, indexOfLastPost);

	// console.log('currentPosts: ', currentPosts);


	const optionsFecha = [
		{ value: 'newest', label: 'Más nuevos' },
		{ value: 'oldest', label: 'Más viejos' },
	];

	const optionsEstado = [
		{ value: 'enabled', label: 'Activado' },
		{ value: 'disabled', label: 'Desactivado' },
		{ value: 'all', label: 'Todos' },
	];

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);
	console.log("user: ", user);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		if(user.type === 2) {
			navigate('/landing-admin');
		}
		if(user.type === 1) {
			navigate('/landing-cuidador');
		}
		if(user.type === 0) {
			navigate('/landing');
		}
	}

	const handleSearchStatusFilterChange = (e) => {
		// console.log(e.value)
		setStatusSearch(e.value);
	}

	// console.log('selected dates interval: ', selectedDatesInterval);

	const handleStatusFilterChange = (e) => {
		console.log('-------------------- setStatusFilter cambia a: ', e.value);
		setUpdateStatusFilter(e.value)
		newSortUsers('', e.value);
		setCurrentPage(1);
	}
	
	const handleDateFilterChange = (e) => {
		setDateFilter(e.value);
		newSortUsers(e.value, '');
		setCurrentPage(1);
	}

	const searchUsers = async () => {
		// console.log('search contracts');

		// console.log('selected dates: ', selectedDatesInterval);

		setSearchButtonClicked(true);
		// console.log('statusSearch when searching contracts: ', statusSearch)
		setUpdateStatusSearch(statusSearch);
		setUpdateStatusFilter(statusSearch);
		// setDateFilter('newest');

		// search contracts by client email and or caregiver email and or a range of dates and or status
		try {
			// console.log('statusSearch: ', statusSearch);
			console.log('status: ', statusSearch);
            console.log(`http://localhost:5000/users?user_email=${userEmail}&user_firstname=${userFirstname}&user_lastname=${userLastname}&status=${statusSearch}`);
			
			// get coinciding user IDS from user table first, then get contracts

            const response = await fetch(`http://localhost:5000/users?user_email=${userEmail}&user_firstname=${userFirstname}&user_lastname=${userLastname}&status=${statusSearch}`);
            const jsonData = await response.json();

			console.log('----------------------------------- users: ', jsonData);

			jsonData.sort((a, b) => {
				const dateA = moment(a.date, 'DD/MM/YYYY');
				const dateB = moment(b.date, 'DD/MM/YYYY');
				return dateB.diff(dateA);
			});

			// console.log('jsonData: ');
			// console.log(jsonData);

            setUsers(jsonData);
			setDisplayedUsers(jsonData);

        } catch (error) {
            console.error(error.message);
        }

	}

	const changeContractStatusToComplete = async (contract) => {
		// console.log('change status to complete, contract: ', contract);

		let bodyJSON = { "status": "completed" };

		// update contract status by its id (contract.id)
		const contract_update = await fetch(
			`http://localhost:5000/contract/${contract.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(bodyJSON)
			}
		)
			.then(response => response.json())
			.then(result => {
				// console.log('result: ', result);
				// console.log('contracts: ', contracts)
				// console.log('displayed contracts: ', displayedContracts)

				if(result.id > 0) {
					setUsers(users.map((user) => user.id === result.id ? { ...user, status: 'completed' } : user));
					setDisplayedUsers(displayedUsers.map((user) => user.id === result.id ? { ...user, status: 'completed' } : user));
				}
			})

		// updatear contracts y displayed contracts.
	}

	const newSortUsers = (date, status) => {
		// de todos los contratos (contracts) filtrarlos por fecha, y luego por estado, todo en esta func, y 
		// hacer un setDisplayedContracts($contractsFiltered)

		// console.log('dateFilter: ', date);
		// console.log('statusFilter: ', status);

		let usersFiltered = [];

		if(status !== '') {
			if(dateFilter === 'newest'){
				usersFiltered = sortUsersByNewest(usersFiltered);
			}
			if(dateFilter === 'oldest'){
				usersFiltered = sortUsersByOldest(usersFiltered);
			}

			if(status === 'enabled'){
				usersFiltered = sortUsersByEnabled(usersFiltered);
			}
			if(status === 'disabled'){
				usersFiltered = sortUsersByDisabled(usersFiltered);
			}
			if(status === 'all'){
				usersFiltered = sortUsersByAll(usersFiltered);
			}
		}

		if(date !== '') {
			if(date === 'newest'){
				usersFiltered = sortUsersByNewest(usersFiltered);
			}
			if(date === 'oldest'){
				usersFiltered = sortUsersByOldest(usersFiltered);
			}

			if(statusFilter === 'enabled'){
				usersFiltered = sortUsersByEnabled(usersFiltered);
			}
			if(statusFilter === 'disabled'){
				usersFiltered = sortUsersByDisabled(usersFiltered);
			}
			if(statusFilter === 'all'){
				usersFiltered = sortUsersByAll(usersFiltered);
			}
		}

		// console.log(' ---- contracts filtered: ', usersFiltered);

		if(usersFiltered.length === 0) {
			setNoUsersWithThatStatusMessage(status);
		}
		
		setDisplayedUsers(usersFiltered);
	}

	const sortUsersByEnabled = (usersFiltered) => {
		// console.log('sortContractsByActive');

		usersFiltered = usersFiltered.filter(user => user.enabled === true);

		// console.log('by active contracts: ', usersFiltered);

		return usersFiltered;
	}

	const sortUsersByDisabled = (usersFiltered) => {
		// console.log('sortContractsByInactive');

		usersFiltered = usersFiltered.filter(user => user.enabled === false);

		// console.log('by inactive contracts: ', usersFiltered);

		return usersFiltered;
	}

	const sortUsersByAll = (usersFiltered) => {
		// console.log('sortContractsByAll');

		// console.log('by all contracts: ', usersFiltered);

		return usersFiltered;
	}

	const sortUsersByOldest = () => {
		// console.log('sort contracts by oldest');

		setDateFilter('oldest');

		let sortedArray = [...users];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateA.diff(dateB);
		});

		setDisplayedUsers(sortedArray);

		// console.log('by oldest users: ', sortedArray);

		return sortedArray;
	}
	
	const sortUsersByNewest = () => {
		// console.log('sort users by newest');

		setDateFilter('newest');

		let sortedArray = [...users];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateB.diff(dateA);
		});

		// console.log('by newest contracts: ', sortedArray);

		return sortedArray;
	}

    // get all users function
    // const getContracts = async () => {
    //     try {
    //         console.log(`http://localhost:5000/contract?user_id=${userId}`)

    //         const response = await fetch(`http://localhost:5000/contract?user_id=${userId}`);
    //         const jsonData = await response.json();

	// 		jsonData.sort((a, b) => {
	// 			const dateA = moment(a.date, 'DD/MM/YYYY');
	// 			const dateB = moment(b.date, 'DD/MM/YYYY');
	// 			return dateB.diff(dateA);
	// 		});

	// 		console.log('jsonData: ');
	// 		console.log(jsonData);

    //         setContracts(jsonData);
	// 		setDisplayedContracts(jsonData);

    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // };

    const getUserData = async () => {
		const response = await fetch("http://localhost:5000/cuidadores/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

    // when page loads, get user data
    useEffect(() => {
        getUserData();
    }, []);

    // console.log('contracts');
	
	console.log('estado find cancelled: ', [optionsEstado.find((option) => option.value === statusSearch)]);
	console.log('optionsEstado: ', optionsEstado);
	

	if(isAuthenticated){
		return (
			<Fragment>
                <div className='relative'>
					<ClientBottomBar />
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Usuarios</h1>
					</div>
					<div className='mb-28'>
						<div className='flex flex-col mx-5 mt-2 gap-3'>
							<div className='flex flex-col'>
								<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Email del usuario
								</label>
								<input
									type="text"
									name="user_id"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
									value={userEmail}
									onChange={e => setUserEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className='flex flex-col mx-5 mt-2 gap-3'>
							<div className='flex flex-col'>
								<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Nombre
								</label>
								<input
									type="text"
									name="user_firstname"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
									value={userFirstname}
									onChange={e => setUserFirstname(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className='flex flex-col mx-5 mt-2 gap-3'>
							<div className='flex flex-col'>
								<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Apellido
								</label>
								<input
									type="text"
									name="user_lastname"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
									value={userLastname}
									onChange={e => setUserLastname(e.target.value)}
									required
								/>
							</div>
						</div>

						<div className='mx-5 mt-3 mb-6 flex flex-col items-start'>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Estado del usuario
							</label>
							<Select
								defaultValue={optionsEstado.find(option => option.value === 'all')}
								onChange={ handleSearchStatusFilterChange }
								placeholder={'Estado:'}
								options={optionsEstado}
								maxMenuHeight={240}
								className='rounded-md w-full'
								isSearchable={false}
								theme={(theme) => ({
									...theme,
									borderRadius: 10,
									colors: {
									...theme.colors,
									primary25: '#8FD5FF',
									primary: 'black',
									},
								})}
							/>
						</div>

						<div className='flex flex-row justify-center'>
							<button
								className='text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/3 py-2.5 mb-7 text-center'
								onClick = {searchUsers}
							>
								Buscar usuarios
							</button>
						</div>

						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedUsers.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						{/* <p className='m-5'>Más nuevos</p> */}
						{searchButtonClicked && (
							<>
							<div className='flex flex-row'>
								<Select
									// value={selectedHoraDesde}
									onChange={e => handleDateFilterChange(e)}
									placeholder={'Fecha:'}
									options={optionsFecha}
									maxMenuHeight={240}
									isSearchable={false}
									className='rounded-md m-5 w-1/2'
									theme={(theme) => ({
										...theme,
										borderRadius: 10,
										colors: {
										...theme.colors,
										primary25: '#8FD5FF',
										primary: 'black',
										},
									})}
								/>
								{searchButtonClicked && updateStatusSearch === 'all' && (
									<Select
										value={optionsEstado.find((option) => option.value === updateStatusFilter)}
										onChange={e => handleStatusFilterChange(e)}
										placeholder={'Estado:'}
										options={statusSearch === 'all' ? optionsEstado : [optionsEstado.find((option) => option.value === updateStatusFilter)]}
										maxMenuHeight={240}
										className='rounded-md m-5 w-1/2'
										isSearchable={false}
										theme={(theme) => ({
											...theme,
											borderRadius: 10,
											colors: {
											...theme.colors,
											primary25: '#8FD5FF',
											primary: 'black',
											},
										})}
									/>
								)}
							</div>
							{currentPosts.length < 1 && noUsersWithThatStatusMessage !== '' && (
								<div className='flex flex-row mx-5'>
									<p className='text-md font-normal text-center'>No se han encontrado usuarios en estado <span className='font-bold'>{noUsersWithThatStatusMessage}!</span></p>
								</div>
							)}

							{currentPosts.length < 1 && noUsersWithThatStatusMessage === '' && (
								<div className='flex flex-row w-full justify-center'>
									<p className='text-md font-normal text-center'>No se han encontrado usuarios!</p>
								</div>
							)}

							</>
						)}
						{/* {currentPosts.length > 0 && (
							
						)} */}
						{currentPosts.length > 0 && (
							currentPosts.map(user => (
								<div
									className={`${user.enabled ? 'bg-gradient-to-r from-green-500 to-green-400' 
									: 'bg-gradient-to-r from-red-500 to-red-400'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium`}
									key={user.id}
								>
									<FontAwesomeIcon icon={faPenToSquare} className=''/>
									<p>Editar datos</p>
									<p>ID: {user.id}</p>
									<p>Email: {user.mail}</p>
									<p>Nombre: {user.name}</p>
									<p>Apellido: {user.last_name}</p>
									<p>Estado: {user.enabled ? 'Activado' : 'Desactivado'}</p>
								</div>
							))
						)}
					</div>
                </div>

			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default NewUsersAdmin;