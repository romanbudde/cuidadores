import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCircleXmark, faCircleCheck, faXmark, faX } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import MoonLoader from "react-spinners/ClipLoader";

const ReviewModal = ({ contract, onClose, reviews, setReviews }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [showEditModal, setShowEditModal] = useState(false);

	const [editDataMessageError, setEditDataMessageError] = useState(false);
	const [displayEditDataMessage, setDisplayEditDataMessage] = useState(false);
	const [loading, setLoading] = useState(false);
    
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

	const saveReview = async (values) => {
		setLoading(true);
        // console.log(description);

		console.log('values: ', values);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        // e.preventDefault();
        try {
            const bodyJSON = { 
				observation: values.texto_review,
				review_score: values.puntaje_review,
				customer_id: contract.customer_id,
				caregiver_id: contract.caregiver_id,
				contract_id: contract.id
			};
			// observation, caregiver_id, customer_id, review_score 
			console.log('values at body: ', values);
			console.log('bodyJSON: ', bodyJSON);
            const add_review = await fetch(
                (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `caregiver_review`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json())

            console.log('add review response:');
            console.log(add_review);
            console.log(add_review.id);

			setLoading(false);
			if (add_review.id > 0){
				console.log('Show success message')
				setDisplayEditDataMessage(true);
				setEditDataMessageError(false);
			}
			else {
				setEditDataMessageError(true);
				setEditDataMessageError(true);
			}
			setReviews(add_review.id ? [...reviews, add_review] : reviews);

        } catch (error) {
            console.error(error.message);
        }
    };

	const UpdateSchema = Yup.object().shape({
		texto_review: Yup.string()
			.min(2, 'El texto es demasiado corto!')
			.max(200, 'El texto es demasiado largo!')
			.required('Texto requerido!'),
		puntaje_review: Yup.number()
			.min(1, 'El puntaje mínimo es 1.')
			.max(10, 'El puntaje máximo es 10.')
			.required('Puntaje requerido!')
			.test(
				'maxDecimals',
				'Máximo 2 decimales permitidos',
				(value) => /^\d+(\.\d{1,2})?$/.test(value.toString())
			  ),
	});

	const closeEditDataMessage = () => {
        setDisplayEditDataMessage(false);
		onClose();
    }

	console.log('---------- contract clicked on: ', contract)

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center'>
					<div className='flex flex-col relative bg-gray-800 p-3 rounded-md'>
						<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200 w-full'>
							<FontAwesomeIcon
								className='absolute right-0 top-0 cursor-pointer'
								icon={faXmark}
								onClick={ onClose }
							/>
							<h1 className='flex justify-center font-bold text-lg py-4'>Agregar reseña</h1>
						</div>
						<div className='p-5 flex flex-col gap-5 w-full'>
						<Formik
							// innerRef={formik} // Add a ref to the formik object
							initialValues={{
								texto_review: '',
								puntaje_review: ''
							}}
							validationSchema={UpdateSchema}
							onSubmit={(values) => {
								// same shape as initial values
								saveReview(values);
							}}
						>
							{({ errors, touched, setFieldValue, setFieldError }) => (
								<Form>
									<div className='flex flex-col py-2'>
										<label className="block mb-2 mr-auto text-sm font-medium text-white">
											Texto de la reseña
										</label>
										<Field
											name="texto_review"
											placeholder="ej: Muy buen servicio!"
											className={`${errors.texto_review && touched.texto_review ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
											'bg-gray-50 border text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
										/>
										{errors.texto_review && touched.texto_review ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.texto_review}
											</div>
										) : null}
										<label className="block mt-4 mb-2 mr-auto text-sm font-medium text-white">
											Puntaje
										</label>
										<Field
											name="puntaje_review"
											placeholder="ej: 7.55"
											type="number"
											className={`${errors.puntaje_review && touched.puntaje_review ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
											'bg-gray-50 border text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
										/>
										{errors.puntaje_review && touched.puntaje_review ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.puntaje_review}
											</div>
										) : null}
										<button 
											type="submit"
											className="w-full text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5"
										>
											Enviar reseña
										</button>
									</div>
								</Form>
							)}
						</Formik>
						</div>
					</div>
				</div>
				{  displayEditDataMessage && editDataMessageError === true && (
					<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
						<div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
							<button onClick={ closeEditDataMessage } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
								<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
								<span className="sr-only">Close modal</span>
							</button>
							<p className='font-bold text-2xl text-white'>Error!</p>
							<p className='text-white text-center font-medium'>No se han podido crear la reseña.</p>
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
							<p className='text-white text-center font-medium'>Reseña creada con éxito!</p>
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

export default ReviewModal;