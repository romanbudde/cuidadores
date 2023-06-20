import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";
import '../css/autocomplete.css';

const UserEditData = ({ user, setUser, show, onClose, userTypes }) => {

	console.log('user passed: ', user);

    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    // const [userType, setUserType] = useState('');
	const navigate = useNavigate();
	const cookies = new Cookies();

	const UpdateSchema = Yup.object().shape({
		firstname: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!'),
		lastname: Yup.string()
			.min(2, 'El apellido es demasiado corto!')
			.max(50, 'El apellido es demasiado largo!')
			.required('Campo requerido!'),
		description: Yup.string()
			.min(2, 'La descripción es demasiado larga!')
			.max(50, 'La descripción es demasiado larga!')
			.required('Campo requerido!'),
		hourly_rate: Yup.string()
			.min(1, 'La tarifa es demasiado pequeña!')
			.max(20, 'La tarifa es demasiado larga!'),
			// .required('Campo requerido!'),
		password: Yup.string()
			.min(8, 'La contraseña debe ser mayor a 8 caracteres de largo!')
			.max(50, 'La contraseña es demasiado larga')
			.matches(/^[a-zA-Z0-9]{8,}$/, 'La contraseña tiene que contener solamente números y/o letras!.')
			.required('Campo requerido!'),
		// email: Yup.string().email('Invalid email').required('Campo requerido!'),
		address: Yup.string()
			.min(4, 'Dirección demasiado corta!')
			.max(100, 'La dirección es demasiado larga')
			.matches(/^.*\b\w+\b.*\d.*,.*/, 'La dirección no posee altura de la calle.')
			.required('Campo requerido!'),
	});

	useEffect(() => {
        if (user) {
            setDescription(user.description || '');
            setEmail(user.mail || '');
            setFirstname(user.name || '');
            setLastname(user.last_name || '');
            setHourlyRate(user.hourly_rate || '');
            setAddress(user.address || '');
            // setUserType(user.type || '');
        }
    }, [user]);

    // console.log('----------- userType ---------');
    // console.log(userType);

    if(!show) return null;

    const updateUser = async (values) => {
        // console.log(description);

		console.log('values: ', values);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        // e.preventDefault();
        try {
            const bodyJSON = { ...values };
			bodyJSON.userType = user.type;
			bodyJSON.enabled = user.enabled;
			console.log('userType: ', user.type);
			console.log('enabled: ', user.enabled);
			console.log('bodyJSON: ', bodyJSON);
            const id = user.id;
            const userUpdate = await fetch(
                `http://localhost:5000/cuidadores/${user.id}`,
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
            console.log(userUpdate);
            
            let updatedUser = {
                description: description,
                mail: email,
                name: firstname,
                last_name: lastname,
                // type: userType,
                created_at: userUpdate.created_at, 
                modified_at: userUpdate.modified_at,
                enabled: userUpdate.enabled, 
                id: id
            }

			setUser(userUpdate.id? userUpdate : user);
            
            console.log('updatedUser:');
            console.log(updatedUser);
            console.log('user.id === id? :');
            console.log(user.id === id ? 'true' : 'false');

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
			<Formik
				// innerRef={formik} // Add a ref to the formik object
				initialValues={{
					firstname: firstname,
					lastname: lastname,
					address: address,
					email: email,
					description: description,
					hourly_rate: hourlyRate,
				}}
				validationSchema={UpdateSchema}
				// onSubmit={onSubmitUser}
				onSubmit={(values) => {
					// same shape as initial values
					// setFieldValue('address', address);
					console.log(values);
					updateUser(values);
				}}
			>
				{({ errors, touched, setFieldValue, setFieldError }) => (
					<Form>
						<div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
							<div className='flex flex-col relative bg-gray-100 p-7 rounded-md'>
								<button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
									<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
									<span className="sr-only">Close modal</span>
								</button>
								<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Nombre
								</label>
								<Field
									name="firstname"
									placeholder="ej: Pedro"
									className={`${errors.firstname && touched.firstname ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
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
								<Field name="lastname" placeholder="ej: Gomez" className={`${errors.lastname && touched.lastname ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
									{errors.lastname && touched.lastname ? (
										<div className='text-red-500 font-normal w-full text-sm text-left'>
											{errors.lastname}
										</div>
									) : null}
								{/* <label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Email
								</label>
								<Field name="email" type="email" placeholder="ej: pedrogomez@hotmail.com" className={`${errors.email && touched.email ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
									{errors.email && touched.email ? (
										<div className='text-red-500 font-normal w-full text-sm text-left'>
											{errors.email}
										</div>
									) : null} */}
								<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Descripción
								</label>
								<Field
									name="description"
									placeholder="Tu descripción"
									className={`${errors.description && touched.description ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
								/>
									{errors.description && touched.description ? (
										<div className='text-red-500 font-normal w-full text-sm text-left'>
											{errors.description}
										</div>
									) : null}
								<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Contraseña
								</label>
								<Field name="password" type="password" placeholder="••••••" className={`${errors.password && touched.password ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
								'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
									{errors.password && touched.password ? (
										<div className='text-red-500 font-normal w-full text-sm text-left'>
											{errors.password}
										</div>
									) : null}
								{user.type === 1 && (
									<div className='flex flex-col'>
										<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
											Tarifa por media hora
										</label>
										<Field name="hourly_rate" type="text" placeholder="ej: 2500" className={`${errors.hourly_rate && touched.hourly_rate ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
										'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
										{errors.hourly_rate && touched.hourly_rate ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.hourly_rate}
											</div>
										) : null}
									</div>
                            	)}
								<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Dirección
								</label>
								<Autocomplete
									apiKey={'AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4'}
									debounce={1000}
									name='address'
									placeholder='Escriba su dirección'
									className={`${errors.address && touched.address ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
									style={{ width: "100%" }}
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
									defaultValue={address}
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
									Guardar mis datos
								</button>
							</div>
						</div>
					</Form>
				)}

            {/* <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5'>
                        <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit user
                            </h3>
                            
                        </div>
                        <form className="space-y-6">
                            <div className='flex flex-col hidden'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    User ID (non editable)
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={user.id}
                                    disabled
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email ? email : ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Descripcion
								</label>
                                <input 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={description ? description : ''}
                                    onChange={e => setDescription(e.target.value)}
                                    name="description" 
                                    placeholder="Tu descripcion"
                                    required
									/>
                            </div>

							<div className='flex flex-col hidden'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
									Tipo de usuario
								</label>
                                <input 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={userType ? userType : ''}
                                    onChange={e => setUserType(e.target.value)}
                                    name="user_type"
                                    disabled
									/>
                            </div>
                            
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={firstname ? firstname : ''}
                                    onChange={e => setFirstname(e.target.value)}
                                    required
									/>
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={lastname ? lastname : ''}
                                    onChange={e => setLastname(e.target.value)}
                                    required
									/>
                            </div>

                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={address ? address : ''}
									placeholder='ej: Mendoza 555, Rosario, Santa Fe, Argentina'
                                    onChange={e => setAddress(e.target.value)}
                                    required
									/>
                            </div>

                            { userType === 1 && (
								<div className='flex flex-col'>
                                    <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                        Tarifa por media hora:
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={hourlyRate ? hourlyRate : ''}
                                        onChange={e => setHourlyRate(e.target.value)}
                                        required
										/>
                                </div>
                            )}


                            <button
                                type="submit" 
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e) => { 
									updateUser(e);
                                    onClose();
                                }}
								>
                                Save user
                            </button>
                        </form>
                    </div>
                </div>
            </div> */}
			</Formik>
        </Fragment>
    );
}

export default UserEditData;