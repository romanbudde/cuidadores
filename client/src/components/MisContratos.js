import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faMoneyBillWave, faHandshake, faFilePdf, faCircleInfo, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';
import ReviewModal from './ReviewModal';
import { PDFDownloadLink } from "@react-pdf/renderer";
import Paginate from './Paginate';
import moment from 'moment';
import Select from 'react-select';

import MoonLoader from "react-spinners/ClipLoader";

import ComprobanteContrato from './ComprobanteContrato';
import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const MisContratos = () => {
	const { isAuthenticated, userId } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [cuidadores, setCuidadores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [displayedContracts, setDisplayedContracts] = useState([]);
    const [dateFilter, setDateFilter] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [user, setUser] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [contractClickedOn, setContractClickedOn] = useState('');
    const [loading, setLoading] = useState(true);
    const [showOnlyToday, setShowOnlyToday] = useState(false);
	
	// -- Pagination
    // const [displayedContracts, setDisplayedContracts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedContracts.slice(indexOfFirstPost, indexOfLastPost);

	console.log('currentPosts: ', currentPosts);


	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

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

	const handleCheckboxChange = () => {
		// if(showOnlyToday === true) {
		// 	setDisplayedContracts(displayedContracts.filter(contract => contract.date === moment().format('DD/MM/YYYY')));
		// }
		// else {
		// 	setDisplayedContracts(displayedContracts.filter(contract => contract.date === moment().format('DD/MM/YYYY')));
		// }
		newSortContracts(dateFilter, statusFilter, !showOnlyToday);
		setShowOnlyToday(!showOnlyToday);
		setCurrentPage(1);
	}

	const handleDisplayReviewModal = (id) => {
		setShowReviewModal(true);
		setContractClickedOn(id);
	}

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.value)
		newSortContracts('', e.value, showOnlyToday);
		setCurrentPage(1);
	}
	
	const handleDateFilterChange = (e) => {
		setDateFilter(e.value);
		newSortContracts(e.value, '', showOnlyToday);
		setCurrentPage(1);
	}

	const handleShowReviewModal = () => {
		setShowReviewModal(true);
	}

	const onCloseReviewModal = () => {
		setShowReviewModal(false);
	}

	const markContractAsPaid = async (contract) => {

		let bodyJSON = { 
			user_type: user.type
		};

		// update contract cash payment status by its id (contract.id)
		const contract_update = await fetch(
			(process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `contract_cash_confirmation/${contract.id}`,
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
				console.log('result: ', result);
				console.log('contracts: ', contracts)
				console.log('displayed contracts: ', displayedContracts)

				if(result.id > 0) {
					if(user.type === 1) {
						setContracts(contracts.map((contract) => contract.id === result.id ? { ...contract, caregiver_cash_confirmation: true, payment_status: "approved" } : contract));
						setDisplayedContracts(displayedContracts.map((contract) => contract.id === result.id ? { ...contract, caregiver_cash_confirmation: true, payment_status: "approved"  } : contract));
					}
					if(user.type === 0) {
						setContracts(contracts.map((contract) => contract.id === result.id ? { ...contract, customer_cash_confirmation: true} : contract));
						setDisplayedContracts(displayedContracts.map((contract) => contract.id === result.id ? { ...contract, customer_cash_confirmation: true } : contract));
					}
				}
			})
	}

	const changeContractStatusToComplete = async (contract) => {
		console.log('change status to complete, contract: ', contract);

		let bodyJSON = { "status": "completed" };

		// update contract status by its id (contract.id)
		const contract_update = await fetch(
			(process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `contract/${contract.id}`,
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
				console.log('result: ', result);
				console.log('contracts: ', contracts)
				console.log('displayed contracts: ', displayedContracts)

				if(result.id > 0) {
					setContracts(contracts.map((contract) => contract.id === result.id ? { ...contract, status: 'completed' } : contract));
					setDisplayedContracts(displayedContracts.map((contract) => contract.id === result.id ? { ...contract, status: 'completed' } : contract));
				}
			})

		// updatear contracts y displayed contracts.


	}

	const newSortContracts = (date, status, onlyToday) => {
		// de todos los contratos (contracts) filtrarlos por fecha, y luego por estado, todo en esta func, y 
		// hacer un setDisplayedContracts($contractsFiltered)

		console.log('dateFilter: ', date);
		console.log('statusFilter: ', status);
		console.log('onlyToday: ', onlyToday);

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

		if(onlyToday === true){
			contractsFiltered = sortContractsForToday(contractsFiltered);
		}
		
		
		setDisplayedContracts(contractsFiltered);
	}

	const sortContractsByActive = (contractsFiltered) => {
		console.log('sortContractsByActive');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'active');

		console.log('by active contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByInactive = (contractsFiltered) => {
		console.log('sortContractsByInactive');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'inactive');

		console.log('by inactive contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCompleted = (contractsFiltered) => {
		console.log('sortContractsByCompleted');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'completed');

		console.log('by completed contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCancelled = (contractsFiltered) => {
		console.log('sortContractsByCancelled');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'cancelled');

		console.log('by cancelled contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByAll = (contractsFiltered) => {
		console.log('sortContractsByAll');

		console.log('by all contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsForToday = (contractsFiltered) => {
		console.log('contracts for today!');

		const currentDate = moment().format('DD/MM/YYYY');

		contractsFiltered = contractsFiltered.filter(contract => {
			const contractDate = moment(contract.date, 'DD/MM/YYYY').format('DD/MM/YYYY');
			return contractDate === currentDate;
		});

		return contractsFiltered;
	}

	const sortContractsByOldest = () => {
		console.log('sortContractsByOldest');

		setDateFilter('oldest');

		let sortedArray = [...contracts];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateA.diff(dateB);
		});

		setDisplayedContracts(sortedArray);

		console.log('by oldest contracts: ', sortedArray);

		return sortedArray;
	}
	
	const sortContractsByNewest = () => {
		console.log('sortContractsByNewest');

		setDateFilter('newest');

		let sortedArray = [...contracts];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateB.diff(dateA);
		});

		console.log('by newest contracts: ', sortedArray);

		return sortedArray;
	}

	const formatTimeRange = (startTime, endTime) => {
		return `${moment(startTime, 'HH:mm').format('HH:mm')} a ${moment(endTime, 'HH:mm').add(30, 'minutes').format('HH:mm')}`;
	  };
	  
	const renderTimeRanges = (horarios) => {
		let timeRanges = [];
		
		for (let i = 0; i < horarios.length; i++) {
			let startTime = horarios[i];
			let endTime = horarios[i];
		
			while (i + 1 < horarios.length && moment(horarios[i + 1], 'HH:mm').diff(moment(horarios[i], 'HH:mm'), 'minutes') === 30) {
				endTime = horarios[i + 1];
				i++;
			}
		
			timeRanges.push(formatTimeRange(startTime, endTime));
		}
		
		return timeRanges.join(', y de ');
	};

    // get all users function
    const getContracts = async () => {
        try {
            // console.log(`http://localhost:5000/contract?user_id=${userId}`)

            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `contract?user_id=${userId}`);
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
		const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `cuidadores/${userId}`);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all reviews
    const getCuidadores = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `fetch-cuidadores`);
            const jsonData = await response.json();

			console.log('---- inside getCuidadores ----');
			console.log(jsonData);

			setCuidadores(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all reviews
    const getClientes = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `fetch-clientes`);
            const jsonData = await response.json();

			console.log('---- inside getClientes ----');
			console.log(jsonData);

			setClientes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	console.log('cuidadores: ', cuidadores)

	// get all reviews
    const getReviews = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `caregiver_review?customer_id=${userId}`);
            const jsonData = await response.json();

			console.log('---- inside getReviews ----');
			console.log(jsonData);

			setReviews(jsonData);
        } catch (error) {
			console.error(error.message);
        }
		setLoading(false);
    };

	console.log('reviews: ', reviews)

    // when page loads, get all Users
    useEffect(() => {
        getContracts();
        getCuidadores();
        getClientes();
        getUserData();
		getReviews();
    }, []);

    // console.log('contracts');
    // console.log(contracts);

	if(isAuthenticated){
		return (
			<Fragment>
                <div className='relative'>
					{user.type === 0 && (
						<ClientBottomBar />
					)}
					{user.type === 1 && (
						<CuidadorBottomBar
							userType = {user.type}
						/>
					)}
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Mis contratos</h1>
					</div>
					<div className='mb-28'>
						<div className='flex flex-row justify-center items-center gap-1 mt-3'>
							{/* <input type="checkbox"></input>
							<p>Mostrar contratos de hoy</p> */}
							<input
								type="checkbox"
								value="only-today"
								checked={showOnlyToday}
								onChange={handleCheckboxChange}
								class="w-6 h-6 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
							>	
							</input>
							<label for="teal-checkbox" class="ml-2 text-md font-medium text-gray-900">
								Mostrar contratos para hoy
							</label>
						</div>
						<div className='flex flex-row'>
							<Select
								// value={selectedHoraDesde}
								onChange={e => handleDateFilterChange(e)}
								placeholder={'Fecha:'}
								options={optionsFecha}
								isSearchable={false}
								maxMenuHeight={240}
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
							<Select
								// value={selectedHoraDesde}
								onChange={e => handleStatusFilterChange(e)}
								placeholder={'Estado:'}
								isSearchable={false}
								options={optionsEstado}
								maxMenuHeight={240}
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
						</div>
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedContracts.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						{/* <p className='m-5'>Más nuevos</p> */}
						{currentPosts.length > 0 && (
							currentPosts.map(contract => (
								<div 
									className={`${contract.status === 'active' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
									: contract.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400'
									: contract.status === 'cancelled' ? 'bg-red-500'
									: 'bg-gray-700'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium relative`}
									key={contract.id}
								>
									{contract.status === 'completed' && user.type === 0 && !reviews.some((review) => review.contract_id === contract.id) &&(
										<>
											<button
												className='p-2 bg-gray-600 rounded-md ml-auto'
												onClick={() => handleDisplayReviewModal(contract.id)}
											>
												Agregar reseña
											</button>
											
										</>
									)}
									{ showReviewModal && contract.id === contractClickedOn && (
										<ReviewModal 
											contract = {contract}
											onClose = {onCloseReviewModal}
											reviews = {reviews}
											setReviews = {setReviews}
										/>
									)}
									{ reviews.some((review) => review.contract_id === contract.id) &&(
										<p className='text-sm text-gray-200 py-1 px-2 bg-gray-500 rounded-full ml-auto'>
											Reseña enviada
										</p>
									)}

									{ user.type === 1 && 
									(contract.customer_cash_confirmation && !contract.caregiver_cash_confirmation) && 
									contract.status === 'completed' && (
										<div
											className='py-2 px-3 mb-3 bg-green-800 rounded-md flex flex-row items-center gap-3'
											onClick={() => markContractAsPaid(contract)}
										>
											<FontAwesomeIcon icon={faSquareCheck} className='text-2xl text-green-400'/>
											<p className='text-sm'>Marcar pago recibido con éxito</p>
										</div>
									)}
									{ user.type === 1 && 
									!contract.customer_cash_confirmation && 
									contract.status === 'completed' && (
										<div className='py-2 px-3 mb-3 bg-gray-600 rounded-md flex flex-row items-center gap-3'>
											<FontAwesomeIcon icon={faCircleInfo} className='text-2xl'/>
											<p className='text-sm'>Esperando pago del cliente</p>
										</div>
									)}
									<p className='font-bold'>Nº: {contract.id}</p>
									<p className='flex flex-row gap-2'><p className='font-bold'>Fecha:</p> {contract.date}</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Nombre del cuidador:</p>
										{cuidadores.find(cuidador => cuidador.id === contract.caregiver_id)?.name}
									</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Email del cuidador:</p> 
										{cuidadores.find(cuidador => cuidador.id === contract.caregiver_id)?.mail}
									</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Nombre del cliente:</p> 
										{clientes.find(cliente => cliente.id === contract.customer_id)?.name}
									</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Email del cliente:</p>
										{clientes.find(cliente => cliente.id === contract.customer_id)?.mail}
									</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Estado del contrato:</p>
										{contract.status === 'active' ? 'Activo' 
										: contract.status === 'completed' ? 'Completado'
										: contract.status === 'cancelled' ? 'Cancelado'
										: contract.status === 'inactive' ? 'Inactivo'
										: ''}
									</p>
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Estado del pago:</p>
									{contract.payment_status === 'approved' ? 'Pagado' 
									: contract.payment_status === 'pending' ? 'Pendiente'
									: contract.payment_status === 'cancelled' ? 'Cancelado'
									: ''}
									</p>
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
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Total:</p>
										${contract.amount}
									</p>
									{/* { contract.horarios && contract.horarios.length === 1 && (
										<>
											<p>Horario inicio: {contract.horarios[0]}</p>
											<p>Horario fin: {moment(contract.horarios[0], 'HH:mm').add(30, 'minutes').format('HH:mm')}</p>
										</>
									)
									} */}
									<p className='flex flex-row gap-2'>
										<p className='font-bold'>Horarios:</p>
										{renderTimeRanges(contract.horarios)}.
									</p>
									{/* <p>Horario inicio: {contract.horarios.join(', ')}</p>
									<p>Horario fin: {contract.horarios.join(', ')}</p> */}
									{ contract.payment_status === 'approved' && (
										// <button className='ml-auto flex flex-row gap-2 items-center p-1.5 bg-gray-500 rounded-sm'>
										// 	<FontAwesomeIcon className='text-gray-200 text-2xl' icon={faFilePdf} />
										// 	Comprobante pdf
										// </button>
										<PDFDownloadLink
											document={
												<ComprobanteContrato 
													contract={contract}
													cuidador={cuidadores.find(cuidador => cuidador.id === contract.caregiver_id)}
													cliente={clientes.find(cliente => cliente.id === contract.customer_id)}
													renderTimeRanges={renderTimeRanges}
												/>
											}
											fileName={`Comprobante_contrato_${contract.id}`}
										>
											{({loading}) => 
												loading ? (
													<button className='ml-auto mt-3 flex flex-row gap-2 items-center p-1.5 bg-gray-500 rounded-sm'>
														Cargando archivo...
													</button>
												) : (
													<button className='ml-auto mt-3 flex flex-row gap-2 items-center p-1.5 bg-gray-500 rounded-sm'>
														<FontAwesomeIcon className='text-gray-200 text-2xl' icon={faFilePdf} />
														Comprobante pdf
													</button>
												)
											}
										</PDFDownloadLink>
									)}

									{/* validar que el ultimo horario del contrato sea mayor a la hora actual (usar moment js) */}
									{
										// console.log('---- horarios: ', contract.horarios)
									}
									{
										// console.log('ultimo horario del contrato: ', contract.horarios[contract.horarios.length - 1])
										// console.log('user type: ', user.type)
										// console.log('comparacion horario entre contract: ', moment(contract.date, 'DD/MM/YYYY').isSame(moment(), 'day') && moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').format('HH:mm') < moment().format('HH:mm'))
										// console.log('---- 1ER CONDICION (mismo dia): ', moment(contract.date, 'DD/MM/YYYY').isSame(moment(), 'day'))
										
									}
									{
										// console.log('-------- 2DA CONDICION (hora menor q actual): ', moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').add(30,'minutes').format('HH:mm') < moment().format('HH:mm'))
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
											<FontAwesomeIcon icon={faCheck} size="2xl" className='text-3xl mr-5 ml-2' style={{color: "#fff",}} />
											<p className=''>Marcar servicio como realizado</p>
										</div>
									)}
									{user.type === 0 && 
									contract.status === 'completed' && 
									contract.payment_method_id === 2 &&
									!contract.customer_cash_confirmation &&
									(
										moment(contract.date, 'DD/MM/YYYY').isBefore(moment().startOf('day')) || 
										(
											moment(contract.date, 'DD/MM/YYYY').isSame(moment(), 'day') && 
											moment(contract.horarios[contract.horarios.length - 1], 'HH:mm').add(30,'minutes').format('HH:mm') < moment().format('HH:mm')
										) 
									) && (
										<div
											className='flex flex-row items-center justify-left bg-black p-2 mt-4 rounded-md w-full bg-gradient-to-r from-green-500 to-green-600'
											onClick={ () => markContractAsPaid(contract) }
										>
											<FontAwesomeIcon icon={faCheck} size="2xl" className='text-3xl mr-7 ml-2' style={{color: "#fff",}} />
											<p className=''>Marcar pago realizado</p>
										</div>
									)}
									{ user.type === 0 && contract.customer_cash_confirmation && !contract.caregiver_cash_confirmation &&(
										<div className='py-2 px-3 mt-3 bg-gray-600 rounded-md flex flex-row items-center gap-3'>
											<FontAwesomeIcon icon={faCircleInfo} className='text-2xl'/>
											<p className='text-sm'>Esperando confirmación del cuidador sobre la recepción del efectivo</p>
										</div>
									)}
									{/* <button
										className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
										onClick={handleShowDisponibilidadModal(contract)}
									>
										Ver disponibilidad
									</button> */}
									{/* <VerDisponibilidad
										contract={contract}
										show={showDisponibilidadModal === contract}
										onClose={handleClose}
									/> */}
								</div>
							))
						)}
					</div>
                </div>
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

export default MisContratos;