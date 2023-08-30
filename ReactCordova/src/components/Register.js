import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';
// import { Autocomplete } from '@lob/react-address-autocomplete';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";
import '../css/autocomplete.css';
import MoonLoader from "react-spinners/ClipLoader";


const Register = () => {

	const cookies = new Cookies();
	const navigate = useNavigate();
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { userId, setUserId } = useContext(AuthContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [address, setAddress] = useState('');
	const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const SignupSchema = Yup.object().shape({
		firstname: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!')
			.matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/, 'Ingrese solo letras y espacios en blanco'),
		lastname: Yup.string()
			.min(2, 'El apellido es demasiado corto!')
			.max(50, 'El apellido es demasiado largo!')
			.required('Campo requerido!')
			.matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\s]+$/, 'Ingrese solo letras y espacios en blanco'),
		dni: Yup.string()
			.min(6, 'El DNI es demasiado corto!')
			.max(8, 'El DNI es demasiado largo!')
			.required('Campo requerido!'),
		telefono: Yup.string()
			.min(6, 'El telefono es demasiado corto!')
			.max(10, 'El telefono es demasiado largo!')
			.required('Campo requerido!'),
		password: Yup.string()
			.min(8, 'La contraseña debe ser mayor a 8 caracteres de largo!')
			.max(50, 'La contraseña es demasiado larga')
			.matches(/^[a-zA-Z0-9]{8,}$/, 'La contraseña tiene que contener solamente números y/o letras!.')
			.required('Campo requerido!'),
		email: Yup.string().email('Email inválido').required('Campo requerido!'),
		address: Yup.string()
			.min(4, 'Dirección demasiado corta!')
			.max(100, 'La dirección es demasiado larga')
			.matches(/^.*\b\w+\b.*\d.*,.*/, 'La dirección no posee altura de la calle.')
			.required('Campo requerido!'),
	});

	const closeDisplayErrorMessage = () => {
		setDisplayErrorMessage(false);
	}

	const redirectHome = () => {
		navigate('/');
	}

	const onSubmitUser = async (values) => {
		setLoading(true);
		console.log('----------------- on function onSubmitUser -------------- ');

		// e.preventDefault();
		try {
			const body = { ...values };

			console.log(JSON.stringify(body));
			console.log('---- end of body to be submitted ----');
			let newUser = {};
			const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `register/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
				.then(response => response.json())
				.then(result => {
					console.log('register user result: ');
					console.log(result);
					if(result.error) {
						console.log('error al registrar: ', result.error);
						setDisplayErrorMessage(true);
						setErrorMessage(result.error);
					}
					if (result.user && result.user.id) {
						console.log(result);
						newUser = result.user;

						// set the cookie
						cookies.set('auth-token', result.token, { path: '/' });

						// set global context for isAuthenticated to true.
						setIsAuthenticated(true);

						// set global context for userId
						cookies.set('user-id', newUser.id, { path: '/' });
						setUserId(newUser.id);

						// redirect a landing de user o de cuidadores o de admin segun el tipo de usuario.
						console.log('user type: ', newUser.type);

						switch (newUser.type) {
							case 0:
								navigate('/landing');
								break;
							case 1:
								navigate('/landing-cuidador');
								break;
							case 2:
								navigate('/landing-admin');
								break;
						}
					}
				});

		}
		catch (error) {
			console.error(error.message);
		}
		setLoading(false);
	}

	//   const formik = useFormik({
	//     initialValues: {
	//       firstname: '',
	//       lastname: '',
	//       password: '',
	//       address: '', // Initialize the 'address' field
	//       email: '',
	//     },
	//     validationSchema: SignupSchema,
	//     onSubmit: onSubmitUser,
	//   });

	return (
		<Fragment>
			{/* <form className="min-w-70 w-96 rounded-md"> */}
			<Formik
				// innerRef={formik} // Add a ref to the formik object
				initialValues={{
					firstname: '',
					lastname: '',
					dni: '',
					telefono: '',
					password: '',
					address: '',
					email: '',
				}}
				validationSchema={SignupSchema}
				// onSubmit={onSubmitUser}
				onSubmit={(values) => {
					// same shape as initial values
					// setFieldValue('address', address);
					console.log(values);
					onSubmitUser(values);
				}}
			>
				{({ errors, touched, setFieldValue, setFieldError }) => (
					<Form>
						<div className='gap-2 px-10 py-5 mx-auto flex flex-col justify-center items-center'>
							<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
								<FontAwesomeIcon
									className='absolute left-0'
									icon={faChevronLeft}
									onClick={redirectHome}
								/>
								<h1 className='flex justify-center font-bold text-lg py-4'>CuidadorApp</h1>
							</div>
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Nombre
							</label>
							<Field
								name="firstname"
								placeholder="ej: Pedro"
								type="text"
								className={`${errors.firstname && touched.firstname ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
							/>
							{errors.firstname && touched.firstname ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.firstname}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Apellido
							</label>
							<Field name="lastname" placeholder="ej: Gomez" className={`${errors.lastname && touched.lastname ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
							{errors.lastname && touched.lastname ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.lastname}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Email
							</label>
							<Field name="email" type="email" placeholder="ej: pedrogomez@hotmail.com" className={`${errors.email && touched.email ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
							{errors.email && touched.email ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.email}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								DNI
							</label>
							<Field name="dni" type="number" placeholder="ej: 35937038" className={`${errors.dni && touched.dni ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
							{errors.dni && touched.dni ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.dni}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Teléfono
							</label>
							<Field name="telefono" type="number" placeholder="ej: 3413529375" className={`${errors.telefono && touched.telefono ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
							{errors.telefono && touched.telefono ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.telefono}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Contraseña
							</label>
							<Field name="password" type="password" placeholder="••••••" className={`${errors.password && touched.password ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
							{errors.password && touched.password ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.password}
								</div>
							) : null}
							<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
								Dirección
							</label>
							<Autocomplete
								apiKey={'AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4'}
								debounce={1000}
								name='address'
								placeholder='Escriba su dirección'
								className={`${errors.address && touched.address ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
								style={{ width: "100%" }}
								// onPlaceSelected={(place) => {
								// 	console.log(place);
								// 	console.log('formated address: ', place.formatted_address);
								// 	setAddress(place.formatted_address);
								// }}
								onChange={(e) => {
									setFieldValue('address', e.target.value);
									// setFieldError('address', 'Selecciona una direccion del menu desplegable!');
									console.log(e.target.value)
								}}
								onPlaceSelected={(place) => {
									console.log(place);
									console.log('formated address: ', place.formatted_address);
									setFieldValue('address', place.formatted_address);
								}}
								options={{
									types: ["address"],
									componentRestrictions: { country: "ar" },
								}}
								defaultValue=""
							/>
							{errors.address && touched.address ? (
								<div className='text-red-500 font-normal w-full text-sm text-left'>
									{errors.address}
								</div>
							) : null}
							<button
								type="submit"
								className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
							>
								Crear cuenta
							</button>
						</div>
					</Form>
				)}
			</Formik>
			{displayErrorMessage && (
				<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
					<div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
						<button onClick={ closeDisplayErrorMessage } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
							<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
							<span className="sr-only">Close modal</span>
						</button>
						<p className='font-bold text-2xl text-white'>Error!</p>
						<p className='text-white text-center font-medium'>{errorMessage}</p>
						<FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
						<button
							className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
							onClick={ closeDisplayErrorMessage }
						>
							Continuar
						</button>
					</div>
				</div>
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

	)
}

export default Register;