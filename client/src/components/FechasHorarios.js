import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const FechasHorarios = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);
    const [date, setDate] = useState(new Date());
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectFechasYHorarios = () => {
		navigate('/fechas-y-horarios');
	}

	const redirectProfile = () => {
		navigate('/filter-cuidadores');
	}

	const onChange = (selectedDate) => {
		// esto deberia tambien llamar al backend y traer los horarios disponibles para esa fecha.

		setDate(selectedDate);
		console.log("selected date: ", selectedDate);
	};

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='space-y-5 p-10 my-20 mx-auto flex flex-col justify-center items-center bg-blue-100 min-w-70 w-96 rounded-md bg-slate-200z'>
					<h1>Tus dias y horarios disponibles</h1>
					<Calendar className={'rounded-md border-transparent'} onChange={onChange} value={date} />
					<div className='w-full flex flex-row items-center gap-10'>
						<div className='flex flex-col justify-between w-full'>
							<p>Desde</p>
							<select className='border-none rounded-md'>
								<option>00:00</option>
								<option>00:30</option>
								<option>01:00</option>
								<option>01:30</option>
							</select>

						</div>
						<div className='flex flex-col justify-between w-full'>
							<p>Hasta</p>
							<select className='border-none rounded-md'>
								<option>00:30</option>
								<option>01:00</option>
								<option>01:30</option>
								<option>02:00</option>

							</select>
						</div>
					</div>
					<button className='w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
						Disponibilizar horarios
					</button>
					<h4>Tus horarios para el día</h4>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FechasHorarios;