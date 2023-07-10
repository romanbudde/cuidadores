import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck } from '@fortawesome/free-solid-svg-icons';
import Datepicker from "react-tailwindcss-datepicker";
import '../css/datepicker.css';
import dayjs from 'dayjs';
import moment from 'moment';
import ClientBottomBar from './ClientBottomBar';
import Paginate from './Paginate';
import Select from 'react-select';

import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const ContractsAdmin = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const { isAuthenticated, userId } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [displayedContracts, setDisplayedContracts] = useState([]);
    const [searchButtonClicked, setSearchButtonClicked] = useState(false);
    const [dateFilter, setDateFilter] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updateStatusFilter, setUpdateStatusFilter] = useState('all');
    const [updateStatusSearch, setUpdateStatusSearch] = useState('all');
    const [userEmail, setUserEmail] = useState('');
    const [statusSearch, setStatusSearch] = useState('all');
    const [caregiverEmail, setCaregiverEmail] = useState('');
    const [noContractsWithThatStatusMessage, setNoContractsWithThatStatusMessage] = useState('');
	const [selectedDatesInterval, setSelectedDatesInterval] = useState({});
    const [user, setUser] = useState([]);
	
	// -- Pagination
    // const [displayedContracts, setDisplayedContracts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedContracts.slice(indexOfFirstPost, indexOfLastPost);

	// console.log('currentPosts: ', currentPosts);


	const optionsFecha = [
		{ value: 'newest', label: 'Más nuevos' },
		{ value: 'oldest', label: 'Más viejos' },
	];

	const optionsEstado = [
		{ value: 'active', label: 'Activos' },
		{ value: 'inactive', label: 'Inactivos' },
		{ value: 'cancelled', label: 'Cancelados' },
		{ value: 'completed', label: 'Completados' },
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

	// Convert a date from the format "yyyy-mm-dd" to "dd/mm/yyyy".
	const formatDate = (dateString) => {
		console.log('dateString to format: ', dateString);
		const date = dayjs(dateString);
		const formattedDate = date.format('DD/MM/YYYY');
		
		console.log(formattedDate);
		return formattedDate;
	};

	const handleSelectedDatesIntervalChange = (newInterval) => {
		console.log("Dates interval new value:", newInterval);
		let startDate = formatDate(newInterval.startDate);
		let endDate = formatDate(newInterval.endDate);

		console.log(`startDate at Interval Change: ${startDate}`);
		console.log(`endDate at Interval Change: ${endDate}`);

		// console.log("Formatted dates interval new value:", newInterval);
		if(newInterval.startDate && newInterval.endDate) {
			setSelectedDatesInterval(newInterval);
		}
		else {
			setSelectedDatesInterval({});
		}

		console.log('start date: ', startDate);
		console.log('end date: ', endDate);
	}

	console.log('selected dates interval: ', selectedDatesInterval);

	const handleStatusFilterChange = (e) => {
		console.log('-------------------- setStatusFilter cambia a: ', e.value);
		setUpdateStatusFilter(e.value)
		newSortContracts('', e.value);
		setCurrentPage(1);
	}
	
	const handleDateFilterChange = (e) => {
		setDateFilter(e.value);
		newSortContracts(e.value, '');
		setCurrentPage(1);
	}

	const searchContracts = async () => {
		// console.log('search contracts');

		// console.log('selected dates: ', selectedDatesInterval);

		setSearchButtonClicked(true);
		// console.log('statusSearch when searching contracts: ', statusSearch)
		setUpdateStatusSearch(statusSearch);
		setUpdateStatusFilter(statusSearch);
		setDateFilter('newest');

		let dateStart = '';
		let dateEnd = '';
		if(Object.keys(selectedDatesInterval).length > 0) {
			// console.log('selected dates (start): ', moment(selectedDatesInterval.startDate).format('DD/MM/YYYY'));
			// console.log('selected dates (end): ', moment(selectedDatesInterval.endDate).format('DD/MM/YYYY'));
			dateStart = moment(selectedDatesInterval.startDate).format('DD/MM/YYYY');
			dateEnd = moment(selectedDatesInterval.endDate).format('DD/MM/YYYY');
		}

		// search contracts by client email and or caregiver email and or a range of dates and or status
		try {
			// console.log('statusSearch: ', statusSearch);
            console.log(`http://localhost:5000/contracts?client_email=${userEmail}&caregiver_email=${caregiverEmail}&start_date=${dateStart}&end_date=${dateEnd}&status=${statusSearch}`);
			
			// get coinciding user IDS from user table first, then get contracts

            const response = await fetch(`http://localhost:5000/contracts?client_email=${userEmail}&caregiver_email=${caregiverEmail}&start_date=${dateStart}&end_date=${dateEnd}&status=${statusSearch}`);
            const jsonData = await response.json();

			console.log('contracts: ', jsonData);

			jsonData.sort((a, b) => {
				const dateA = moment(a.date, 'DD/MM/YYYY');
				const dateB = moment(b.date, 'DD/MM/YYYY');
				return dateB.diff(dateA);
			});

			// console.log('jsonData: ');
			// console.log(jsonData);

            setContracts(jsonData);
			setDisplayedContracts(jsonData);

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
					setContracts(contracts.map((contract) => contract.id === result.id ? { ...contract, status: 'completed' } : contract));
					setDisplayedContracts(displayedContracts.map((contract) => contract.id === result.id ? { ...contract, status: 'completed' } : contract));
				}
			})

		// updatear contracts y displayed contracts.


	}

	const newSortContracts = (date, status) => {
		// de todos los contratos (contracts) filtrarlos por fecha, y luego por estado, todo en esta func, y 
		// hacer un setDisplayedContracts($contractsFiltered)

		// console.log('dateFilter: ', date);
		// console.log('statusFilter: ', status);

		let contractsFiltered = [];

		if(status !== '') {
			if(dateFilter === 'newest'){
				contractsFiltered = sortContractsByNewest(contractsFiltered);
			}
			if(dateFilter === 'oldest'){
				contractsFiltered = sortContractsByOldest(contractsFiltered);
			}

			if(status === 'active'){
				contractsFiltered = sortContractsByActive(contractsFiltered);
			}
			if(status === 'inactive'){
				contractsFiltered = sortContractsByInactive(contractsFiltered);
			}
			if(status === 'completed'){
				contractsFiltered = sortContractsByCompleted(contractsFiltered);
			}
			if(status === 'cancelled'){
				contractsFiltered = sortContractsByCancelled(contractsFiltered);
			}
			if(status === 'all'){
				contractsFiltered = sortContractsByAll(contractsFiltered);
			}
		}

		if(date !== '') {
			if(date === 'newest'){
				contractsFiltered = sortContractsByNewest(contractsFiltered);
			}
			if(date === 'oldest'){
				contractsFiltered = sortContractsByOldest(contractsFiltered);
			}

			if(statusFilter === 'active'){
				contractsFiltered = sortContractsByActive(contractsFiltered);
			}
			if(statusFilter === 'inactive'){
				contractsFiltered = sortContractsByInactive(contractsFiltered);
			}
			if(statusFilter === 'completed'){
				contractsFiltered = sortContractsByCompleted(contractsFiltered);
			}
			if(statusFilter === 'cancelled'){
				contractsFiltered = sortContractsByCancelled(contractsFiltered);
			}
			if(statusFilter === 'all'){
				contractsFiltered = sortContractsByAll(contractsFiltered);
			}
		}

		// console.log(' ---- contracts filtered: ', contractsFiltered);

		if(contractsFiltered.length === 0) {
			setNoContractsWithThatStatusMessage(status);
		}
		
		setDisplayedContracts(contractsFiltered);
	}

	const sortContractsByActive = (contractsFiltered) => {
		// console.log('sortContractsByActive');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'active');

		// console.log('by active contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByInactive = (contractsFiltered) => {
		// console.log('sortContractsByInactive');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'inactive');

		// console.log('by inactive contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCompleted = (contractsFiltered) => {
		// console.log('sortContractsByCompleted');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'completed');

		// console.log('by completed contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCancelled = (contractsFiltered) => {
		// console.log('sortContractsByCancelled');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'cancelled');

		// console.log('by cancelled contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByAll = (contractsFiltered) => {
		// console.log('sortContractsByAll');

		// console.log('by all contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByOldest = () => {
		// console.log('sortContractsByOldest');

		setDateFilter('oldest');

		let sortedArray = [...contracts];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateA.diff(dateB);
		});

		setDisplayedContracts(sortedArray);

		// console.log('by oldest contracts: ', sortedArray);

		return sortedArray;
	}
	
	const sortContractsByNewest = () => {
		// console.log('sortContractsByNewest');

		setDateFilter('newest');

		let sortedArray = [...contracts];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateB.diff(dateA);
		});

		// console.log('by newest contracts: ', sortedArray);

		return sortedArray;
	}

    // get all users function
    const getContracts = async () => {
        try {
            console.log(`http://localhost:5000/contract?user_id=${userId}`)

            const response = await fetch(`http://localhost:5000/contract?user_id=${userId}`);
            const jsonData = await response.json();

			jsonData.sort((a, b) => {
				const dateA = moment(a.date, 'DD/MM/YYYY');
				const dateB = moment(b.date, 'DD/MM/YYYY');
				return dateB.diff(dateA);
			});

			console.log('jsonData: ');
			console.log(jsonData);

            setContracts(jsonData);
			setDisplayedContracts(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

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
						<h1 className='flex justify-center font-bold text-lg py-4'>Contratos</h1>
					</div>
					<div className='mb-28'>
						<div className='flex flex-col mx-5 mt-2 gap-3'>
							<div className='flex flex-col'>
								<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Email del cuidador
								</label>
								<input
									type="text"
									name="user_id"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
									value={caregiverEmail}
									onChange={e => setCaregiverEmail(e.target.value)}
									required
								/>
							</div>
							<div className='flex flex-col'>
								<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Email del cliente
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

						<div className='mx-5 mt-3 flex flex-row items-center gap-10'>
							<div className='flex flex-col justify-between w-full'>
								<p>Puede seleccionar un intervalo de fechas:</p>
								<Datepicker
									primaryColor={"emerald"}
									i18n={"es"} 
									// minDate={moment().subtract(1, 'day')} 
									// dateFormat="MMMM eeee d, yyyy h:mm aa"
									separator={"a"}
									displayFormat={"DD/MM/YYYY"} 
									value={selectedDatesInterval}
									locale="es"
									onChange={handleSelectedDatesIntervalChange}
								/>
							</div>
							
						</div>

						<div className='mx-5 mt-3 mb-6 flex flex-col items-start'>
							<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Estado del contrato
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
								onClick = {searchContracts}
							>
								Buscar contratos
							</button>
						</div>

						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedContracts.length}
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
							{currentPosts.length < 1 && noContractsWithThatStatusMessage !== '' && (
								<div className='flex flex-row mx-5'>
									<p className='text-md font-normal text-center'>No se han encontrado contratos en estado <span className='font-bold'>{noContractsWithThatStatusMessage}!</span></p>
								</div>
							)}

							{currentPosts.length < 1 && noContractsWithThatStatusMessage === '' && (
								<div className='flex flex-row w-full justify-center'>
									<p className='text-md font-normal text-center'>No se han encontrado contratos!</p>
								</div>
							)}

							</>
						)}
						{/* {currentPosts.length > 0 && (
							
						)} */}
						{currentPosts.length > 0 && (
							currentPosts.map(contract => (
								<div 
									className={`${contract.status === 'active' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
									: contract.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400'
									: contract.status === 'cancelled' ? 'bg-red-500'
									: 'bg-gray-700'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium`}
									key={contract.id}
								>
									<p>Fecha: {contract.date}</p>
									<p>Estado del contrato: {contract.status === 'active' ? 'Activo' 
									: contract.status === 'completed' ? 'Completado'
									: contract.status === 'cancelled' ? 'Cancelado'
									: contract.status === 'inactive' ? 'Inactivo'
									: ''}</p>
									<p>Estado del pago: {contract.payment_status === 'approved' ? 'Pagado' 
									: contract.payment_status === 'pending' ? 'Pendiente'
									: contract.payment_status === 'cancelled' ? 'Cancelado'
									: ''}</p>
									<div className=''>
										{/* <p>Forma de pago:</p> */}
									{ contract.payment_method_id === 1 && (
										// <FontAwesomeIcon icon={faHandshake} size="xl" className='text-xl' style={{color: "#fff",}} />
										<div className='flex flex-row items-center gap-1'>
											<img src={mercado_pago_icon} width={45} alt="Mercado pago" />
											<span>Mercado Pago</span>
										</div>
									)}
									{ contract.payment_method_id === 2 && (
										// <FontAwesomeIcon icon={faMoneyBillWave} size="xl" className='text-xl' style={{color: "#fff",}} />
										<div className='flex flex-row items-center gap-2'>
											<img src={cash_bill_icon} width={40} alt="Efectivo" />
											<span>Efectivo</span>
										</div>
									)}
									</div>
									<p>Total: ${contract.amount}</p>
									<p>Horarios: {contract.horarios.join(', ')}</p>

									{/* validar que el ultimo horario del contrato sea mayor a la hora actual (usar moment js) */}
									{
										// console.log('ultimo horario del contrato: ', contract.horarios[contract.horarios.length - 1])
										// console.log('user type: ', user.type)
										console.log('comparacion horario entre contract: ', moment(contract.date, 'DD/MM/YYYY').isSame(moment(), 'day') && moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').format('HH:mm') < moment().format('HH:mm'))

										
										// moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').format('HH:mm') < moment().format('HH:mm')
									}
									{user.type === 1 && 
									contract.status === 'active' && 
									(
										moment(contract.date, 'DD/MM/YYYY').isBefore(moment().startOf('day')) || 
										(
											moment(contract.date, 'DD/MM/YYYY').isSame(moment(), 'day') && 
											moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').add(30,'minutes').format('HH:mm') < moment().format('HH:mm')
										) 
									) && (
										<div
											className='flex flex-row items-center justify-left bg-black p-2 mt-4 rounded-md w-full bg-gradient-to-r from-gray-900 to-gray-700'
											onClick={ () => changeContractStatusToComplete(contract) }
										>
											<FontAwesomeIcon icon={faCheck} size="2xl" className='text-3xl mr-7 ml-2' style={{color: "#fff",}} />
											<p className=''>Marcar como completado</p>
										</div>
									)}
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

export default ContractsAdmin;