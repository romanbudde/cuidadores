import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import Calendar from 'react-calendar';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';

const VerDisponibilidad = ({ cuidador, show, onClose }) => {

    // const [userType, setUserType] = useState(user.type);
	const navigate = useNavigate();
	const cookies = new Cookies();
    const [date, setDate] = useState(new Date());

    
    const onChange = (selectedDate) => {
        // esto deberia tambien llamar al backend y traer los horarios disponibles para esa fecha.
        
		setDate(selectedDate);
		console.log("selected date: ", selectedDate);
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
                    <div className='bg-white p-5 rounded flex flex-col gap-5'>
                        <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">
                                Fechas disponibles para el cuidador
                            </h3>
                        </div>
                        <Calendar className={'rounded-md border-transparent'} onChange={onChange} value={date} />
                        
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default VerDisponibilidad;