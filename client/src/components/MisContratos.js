import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faMoneyBillWave, faHandshake } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import Paginate from './Paginate';
import moment from 'moment';
import Select from 'react-select';

import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const MisContratos = () => {
	const { isAuthenticated, userId } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [displayedContracts, setDisplayedContracts] = useState([]);
    const [dateFilter, setDateFilter] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [user, setUser] = useState([]);
	
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

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.value)
		newSortContracts('', e.value);
		setCurrentPage(1);
	}
	
	const handleDateFilterChange = (e) => {
		setDateFilter(e.value);
		newSortContracts(e.value, '');
		setCurrentPage(1);
	}

	const changeContractStatusToComplete = async (contract) => {
		console.log('change status to complete, contract: ', contract);

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

	const newSortContracts = (date, status) => {
		// de todos los contratos (contracts) filtrarlos por fecha, y luego por estado, todo en esta func, y 
		// hacer un setDisplayedContracts($contractsFiltered)

		console.log('dateFilter: ', date);
		console.log('statusFilter: ', status);

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

    // when page loads, get all Users
    useEffect(() => {
        getContracts();
        getUserData();
    }, []);

    // console.log('contracts');
    // console.log(contracts);

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
						<h1 className='flex justify-center font-bold text-lg py-4'>Mis contratos</h1>
					</div>
					<div className='mb-28'>
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

			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default MisContratos;