import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEnvelope, faComment, faPenToSquare, faMapPin, faCoins, faStar, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';

const Account = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [user, setUser] = useState('');
	const [userTypes, setUserTypes] = useState([]);

	const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);

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

	const getUserData = async () => {
		const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `cuidadores/${userId}`);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all users function
    const getUserTypes = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `user_types/`);
            const jsonData = await response.json();

			console.log('---- inside getUserTypes ----');
			console.log(jsonData);

			setUserTypes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	useEffect(() => {
        getUserData();

		getUserTypes();
    }, []);

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='space-y-5 flex flex-col justify-center items-center rounded-md bg-slate-200z'>
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200 w-full'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Mi perfil</h1>
						<FontAwesomeIcon icon={faPenToSquare} className='text-2xl absolute right-5' onClick={handleShow} />
					</div>
					{ user.type === 1 && (
						<CuidadorBottomBar/>
					)}
					{ user.type === 0 && (
						<ClientBottomBar/>
					)}
					<div className='w-full flex flex-col items-center px-5 space-y-3'>
						<h1 className='font-medium text-lg flex flex-row items-center gap-1'>
							Hola, <p className='p-1 px-2 bg-cyan-200 rounded-md'>{user.name}!</p>
						</h1>
						<UserEditData
							user={user}
							setUser={setUser}
							show={showEditModal}
							userTypes={userTypes}
							onClose={handleClose}
						/>
						<div className='w-full ml-5 flex flex-col text-left space-y-4'>
						<div className='flex flex-row gap-3 items-center'>
								<FontAwesomeIcon className='text-2xl' icon={faEnvelope} />
								<p>Tu email actual es {user.mail}</p>
							</div>
							<div className='flex flex-row gap-3 items-center'>
								<FontAwesomeIcon className='text-2xl' icon={faComment} />
								<p>Tu descripción es: {user.description}</p>
							</div>
							<div className='flex flex-row gap-3 items-center'>
								<FontAwesomeIcon className='text-2xl mr-2' icon={faMapPin} />
								<p>Tu dirección es: {user.address}</p>
							</div>
							{ user.type === 1 && (
								<>
									<div className='flex flex-row gap-2'>
										<FontAwesomeIcon className='text-2xl mr-1' icon={faCoins} />
										<p>Tarifa por media hora: {user.hourly_rate}</p>
									</div>
									<div className='flex flex-row gap-2'>
										<FontAwesomeIcon className='text-2xl' icon={faStar} />
										<p>Puntaje promedio segun las reseñas: {user.average_review_score}</p>
									</div>
								</>
							)}
							<div
								className='flex flex-row gap-4 pt-12 items-center'
								onClick={logout}
							>
								<FontAwesomeIcon className='text-2xl rotate-180' icon={faRightFromBracket} />
								<p className='text-gray-700 font-medium text-lg'>Cerrar sesión</p>
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default Account;