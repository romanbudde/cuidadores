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

const ReviewModalAdmin = ({ contract, onClose, review }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [showEditModal, setShowEditModal] = useState(false);

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

	console.log('contract clicked on: ', contract)
	console.log('------------- REVIEW: ', review)

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='fixed inset-0 bg-gray-800 bg-opacity-30 z-50 flex justify-center items-center'>
					<div className='flex flex-col relative bg-gray-800 w-3/4 p-3 rounded-md mx-7'>
						<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200 w-full'>
							<FontAwesomeIcon
								className='absolute right-0 top-0 cursor-pointer'
								icon={faXmark}
								onClick={ onClose }
							/>
							<h1 className='flex justify-center font-bold text-lg py-4'>Datos de la reseña</h1>
						</div>
						<div className='p-5 gap-3 flex flex-col w-full'>
							<p className=''>Texto de la reseña</p>
							<p className='text-white bg-gray-700 p-2'>{review.observation}</p>
							<div className='flex flex-row items-center gap-2'>
								<p className=''>Puntaje: </p>
								<p className='text-white bg-gray-700 p-1'>{review.score}</p>
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

export default ReviewModalAdmin;