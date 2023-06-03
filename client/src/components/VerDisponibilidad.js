import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import moment from 'moment';
import Select from 'react-select';
import Datepicker from "react-tailwindcss-datepicker";


const VerDisponibilidad = ({ cuidador, show, onClose }) => {

    // const [userType, setUserType] = useState(user.type);
	const navigate = useNavigate();
	const cookies = new Cookies();
    const [date, setDate] = useState(new Date());
	const [horariosDisponibles, setHorariosDisponibles] = useState([]);

	let formattedDate = date.toLocaleDateString("en-GB");

	console.log('---- passed cuidador: ----');
	console.log(cuidador);
    
	// get all users function
    const getHorarios = async () => {
        try {
            const response = await fetch("http://localhost:5000/caregiver_get_available_dates?caregiver_id=" + cuidador.id);
            const jsonData = await response.json();

			console.log('---- inside getHorarios ----');
			console.log(jsonData);

            setHorariosDisponibles(jsonData.availabilities.dates);
        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getHorarios();

		// const today = moment().format('DD/MM/YYYY');
    }, []);

    const onChange = (selectedDate) => {
        // esto deberia tambien llamar al backend y traer los horarios disponibles para esa fecha.
        
		setDate(selectedDate);
		console.log("selected date: ", selectedDate);
	};

	const renderHorarios = () => {
		// console.log('-------formattedDate---------');
		// console.log(formattedDate.toString());
		// console.log('-------horariosDisponibles---------');
		// console.log(horariosDisponibles);
		// console.log('-------horariosDisponibles[formattedDate]---------');
		// console.log(horariosDisponibles['25/05/2023']);
		if (horariosDisponibles && horariosDisponibles[formattedDate] && horariosDisponibles[formattedDate].length > 0) {
			return horariosDisponibles[formattedDate].map((horario) => (
				<li className="p-2 pl-5">
				<p>{horario}</p>
				</li>
			));
		}
		else {
			return (
				<li className="p-2 pl-5 bg-slate-300">
				<p>Aún no hay horarios disponibles para este día</p>
				</li>
			);
		}
	};
    
    if(!show) return null;

    return (
        <Fragment>
            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5 items-center justify-center'>
                        <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">
                                Fechas disponibles para el cuidador {cuidador.name} {cuidador.last_name}:
                            </h3>
                        </div>
                        <Calendar className={'rounded-md border-transparent'} onChange={onChange} value={date} />
						<p>Tafira por hora: ${cuidador.hourly_rate}</p>
						<p>Horarios disponibles para el dia {date.toLocaleDateString("en-GB")}</p>
						<ul className="flex flex-col w-96 rounded-md bg-green-300 max-h-60 overflow-auto">
							{console.log('date: ', date)}
							{/* {console.log('formatted date: ', formattedDate)} */}
							{renderHorarios()}
						</ul>
                        
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default VerDisponibilidad;