import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';

const MercadoPagoConfig = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [user, setUser] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [userTypes, setUserTypes] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [showEditModal, setShowEditModal] = useState(false);
	const [loading, setLoading] = useState(true);

	const [editDataMessageError, setEditDataMessageError] = useState(false);
	const [displayEditDataMessage, setDisplayEditDataMessage] = useState(false);
    
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

	const getAccessToken = async () => {
		const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `mercadopago_access_token`);
		const jsonData = await response.json();

		console.log('---- inside getAccessToken ----');
		console.log(jsonData);

		setAccessToken(jsonData.access_token);

		setLoading(false);
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

	const updateMercadopagoConfig = async (values) => {
        // console.log(description);

		console.log('values: ', values);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        // e.preventDefault();
        try {
            const bodyJSON = { ...values };
			console.log('values at body: ', values);
			// bodyJSON.userType = user.type;
			// bodyJSON.enabled = user.enabled;
            const mp_update = await fetch(
                (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `mercadopago_access_token`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json())

            console.log('update response:');
            console.log(mp_update);

			if (mp_update !== ''){
				setEditDataMessageError(false);
				setDisplayEditDataMessage(true);
			}

        } catch (error) {
            console.error(error.message);
        }
    };

	const UpdateSchema = Yup.object().shape({
		access_token: Yup.string()
			.min(2, 'El access token es demasiado corto!')
			.max(200, 'El access token es demasiado largo!')
			.required('Access token requerido!'),
	});

	console.log('----- accessToken: ', accessToken)

	const closeEditDataMessage = () => {
        setDisplayEditDataMessage(false);
    }

	useEffect(() => {
        getUserData();
		getUserTypes();
		getAccessToken();
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
						<h1 className='flex justify-center font-bold text-lg py-4'>Configuración Mercadopago</h1>
					</div>
					<CuidadorBottomBar
						userType = {user.type}
					/>
					<div className='p-5 flex flex-col gap-5 w-4/5'>
					{loading ? (
					<div>Cargando datos...</div>
					) : (
						<Formik
							// innerRef={formik} // Add a ref to the formik object
							initialValues={{
								access_token: accessToken
							}}
							validationSchema={UpdateSchema}
							// onSubmit={onSubmitUser}
							onSubmit={(values) => {
								// same shape as initial values
								updateMercadopagoConfig(values);
							}}
						>
							{({ errors, touched, setFieldValue, setFieldError }) => (
								<Form>
									<div className='flex flex-col py-2'>
										<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
											Access Token
										</label>
										<Field
											name="access_token"
											placeholder="ej: APP_USR-021439124844238720-070912-90070389d55a42626319cd0f07f166e0-141482348"
											className={`${errors.access_token && touched.access_token ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
											'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
										/>
										{errors.access_token && touched.access_token ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.access_token}
											</div>
										) : null}
										<button 
											type="submit"
											className="w-full text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5"
										>
											Guardar datos
										</button>
									</div>
									{  displayEditDataMessage && editDataMessageError === true  &&(
										<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
											<div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
												<button onClick={ closeEditDataMessage } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
													<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
													<span className="sr-only">Close modal</span>
												</button>
												<p className='font-bold text-2xl text-white'>Error!</p>
												<p className='text-white text-center font-medium'>No se han podido guardar los datos.</p>
												<FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
												<button
													className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
													onClick={ closeEditDataMessage }
												>
													Continuar
												</button>
											</div>
										</div>
									)}
									{ displayEditDataMessage && editDataMessageError === false && (
										<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
											<div className='bg-green-400 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
												<button onClick={ closeEditDataMessage } type="button" className="absolute top-2 right-2 text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
													<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
													<span className="sr-only">Close modal</span>
												</button>
												<p className='font-bold text-2xl text-white'>Genial!</p>
												<p className='text-white text-center font-medium'>Datos guardados con éxito</p>
												<FontAwesomeIcon icon={faCircleCheck} size="2xl" className='text-8xl' style={{color: "#fff",}} />
												<button
													className='bg-green-600 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
													onClick={ closeEditDataMessage }
												>
													Continuar
												</button>
											</div>
										</div>
									)}
								</Form>
							)}
						</Formik>
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

export default MercadoPagoConfig;