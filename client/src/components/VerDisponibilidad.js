import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import moment from 'moment';
import Select from 'react-select';
import Datepicker from "react-tailwindcss-datepicker";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faMoneyBillWave, faHandshake } from '@fortawesome/free-solid-svg-icons';
import '../css/calendar.css';

const VerDisponibilidad = ({ cuidador, show, onClose }) => {

	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const navigate = useNavigate();
	const cookies = new Cookies();
    const [date, setDate] = useState(new Date());
	const [horariosDisponibles, setHorariosDisponibles] = useState([]);
	const [checkedHorarios, setCheckedHorarios] = useState([]);
	const [displayCreateContractMessage, setDisplayCreateContractMessage] = useState(false);
	const [createContractMessage, setCreateContractMessage] = useState('');
	const [contractResponseError, setContractResponseError] = useState(false);
	const [chosenPaymentMethod, setChosenPaymentMethod] = useState('');
	const [chosenPaymentMethodId, setChosenPaymentMethodId] = useState('');
	const [displayPaymentMethodModal, setDisplayPaymentMethodModal] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState([]);

	let formattedDate = date.toLocaleDateString("en-GB");

	// console.log('---- passed cuidador: ----');
	// console.log(cuidador);
	// console.log('---- chosen payment method: ----');
	// console.log(chosenPaymentMethod);



    const getPaymentMethods = async () => {
        try {
            const response = await fetch("http://localhost:5000/payment_methods");
            const jsonData = await response.json();

			// console.log('---- inside getPaymentMethods ----');

            // console.log('jsonData: ', jsonData);

            // Get the current date and time using Moment.js
            const today = moment().format("DD/MM/YYYY");

            if(Object.keys(jsonData).length > 0) {
                // for the current day, just leave those times that are higher than the current time.
               
                setPaymentMethods(jsonData.payment_methods);
            }

        } catch (error) {
            console.error(error.message);
        }
    }
    
	// get all users function
    const getHorarios = async () => {
        try {
            const response = await fetch("http://localhost:5000/caregiver_get_available_dates?caregiver_id=" + cuidador.id);
            const jsonData = await response.json();

			// console.log('---- inside getHorarios ----');
			// console.log(jsonData);

            // console.log('jsonData: ', jsonData);
            // console.log('jsonData.availabilities.dates: ', jsonData.availabilities.dates);

            // Get the current date and time using Moment.js
            const today = moment().format("DD/MM/YYYY");

            // console.log('jsonData.availabilities.dates.today: ', jsonData.availabilities.dates[today]);
            // console.log('object keys de json data es mayor q 0?????', Object.keys(jsonData).length > 0);

            if(Object.keys(jsonData).length > 0) {
                // for the current day, just leave those times that are higher than the current time.
                const currentTime = moment().format('HH:mm');

                // if there are times available for the caregiver today, then we filter those basing on current clock time
                if(jsonData.availabilities.dates[today] !== undefined && 
                jsonData.availabilities.dates[today].length > 0) {
                    const timesFilteredForToday = jsonData.availabilities.dates[today].filter(time => {
                        const timeValue = moment(time, 'HH:mm').format('HH:mm');
                        return timeValue > currentTime;
                      });
                    console.log('------------times filtered for today --------------');
                    console.log(timesFilteredForToday);
                    jsonData.availabilities.dates[today] = timesFilteredForToday;
        
                    // Filter the dates that are greater than the current time
                    const filteredDates = jsonData.availabilities.dates;
        
                    console.log('filtered Dates: ', filteredDates);
                    setHorariosDisponibles(filteredDates);
                }
                setHorariosDisponibles(jsonData.availabilities.dates);
            }

        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getHorarios();
        getPaymentMethods();
		// const today = moment().format('DD/MM/YYYY');
    }, []);

    // const handleHorariosArray = (horario) => {
    //     console.log('clicked an horario: ', horario);
    // }
    
    // console.log('checkedHorarios: ', checkedHorarios);
    // console.log(checkedHorarios);

    const handleChosenPaymentMethod = (payment_method_name) => {
        // console.log('------- at handleChosenPaymentMethod, method passed: ', payment_method_name);
        // console.log('------- payment Methods: ', paymentMethods);
        paymentMethods.forEach(method => {
            if(method.name === payment_method_name){
                // guardo el ID del payment_method, que eso es lo que debo guardar en la DB.
                setChosenPaymentMethodId(method.id);
                setChosenPaymentMethod(method.name);
            }
        });
    }
    
    const handleCheckboxChange = (horario) => {
        console.log('clicked an horario: ', horario);
        if (checkedHorarios.includes(horario)) {
          setCheckedHorarios(checkedHorarios.filter((item) => item !== horario));
        } else {
          setCheckedHorarios([...checkedHorarios, horario]);
        }
      };
    

    const onChange = (selectedDate) => {
		setDate(selectedDate);
		console.log("selected date: ", selectedDate);
        setCheckedHorarios([]);
	};

    const closePaymentMethodModal = () => {
        setDisplayPaymentMethodModal(false);
    }

    const closeContractResponseModal = () => {
        setDisplayCreateContractMessage(false);
    }

    // console.log('checkedHorarios: ');
    // console.log(checkedHorarios);
    // console.log('date selected: ', date);
    
    const createContract = async () => {
        // usando los datos de: checkedHorarios, date, userId, cuidadorId. voy al backend y creo el contract.
        const contractDate = date.toLocaleDateString("en-GB");
        console.log('contractDate: ', contractDate);
        console.log('contractCheckedHorarios: ', checkedHorarios);
        console.log('contract cuidador id: ', cuidador.id);
        console.log('contract user id: ', userId);

        // resetear checkedHorarios

        setCheckedHorarios([]);

        let cuidador_id = cuidador.id;

        const body = {
            caregiver_id: cuidador_id, 
            customer_id: userId, 
            date: contractDate, 
            horarios: checkedHorarios,
            payment_method: chosenPaymentMethodId
        };

        const response = await fetch("http://localhost:5000/contract/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        
        const result = await response.json();

        console.log('111111111');
        console.log(result);
        setDisplayPaymentMethodModal(false);
        if(result.error){
            setContractResponseError(true);
            setDisplayCreateContractMessage(true);
            console.log('Display error: ', result.error);
            setCreateContractMessage(result.error);
        }
        else {
            if(chosenPaymentMethod === 'Mercado Pago'){
                console.log('----------payment method es: mercado pago:');

                let title = 'Contrato cuidador';
                // unit_price lo saco de la respuesta de la creacion del contrato en la DB, ya que el amount es calculado por el backend.
                let unit_price = Math.round(result.amount);
                let quantity = 1;
                let external_reference = result.id;

                const body_mercadopago = { title, unit_price, quantity, external_reference };

                const response = await fetch("http://localhost:5000/create-contract", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body_mercadopago)
                })
                .then(response => response.json())
                .then(result => {
                    console.log('------- result de creacion de payment (mercado pago)');
                    console.log(result);
                    // direcciono a mercado pago!
                    window.location.replace(result.response.init_point);
                    // guardo result.response.external_reference en el estado del component (o capaz como cookie?)
                    // porque con este numero identifico unicamente al pago.
                });
            }
            if(chosenPaymentMethod === 'Efectivo'){
                setContractResponseError(false);
                setDisplayCreateContractMessage(true);
                setCreateContractMessage(`Contrato creado con éxito para el día ${date.toLocaleDateString("en-GB")}.`);
            }
        }
        console.log('222222222');
    }

	const renderHorarios = () => {
		// console.log('-------formattedDate---------');
		// console.log(formattedDate.toString());
		// console.log('-------horariosDisponibles---------');
		// console.log(horariosDisponibles);
		// console.log('-------horariosDisponibles[formattedDate]---------');
		// console.log(horariosDisponibles['25/05/2023']);
		if (horariosDisponibles && horariosDisponibles[formattedDate] && horariosDisponibles[formattedDate].length > 0) {
            return horariosDisponibles[formattedDate].map((horario, index) => {
                // console.log('checkedHorarios: ', checkedHorarios);
                // checkedHorarios.includes(horario) ? console.log('includes') : console.log('does NOT include');

                return(
                    <li className='flex flex-row items-center p-7 gap-2 relative' key={index}>
                        <label htmlFor={horario} className='w-full flex items-center cursor-pointer'>
                            <span className={`absolute p-5 inset-0 transition ${checkedHorarios.includes(horario) ? 'bg-green-400' : 'bg-gray-300'}`}>
                                {horario}
                            </span>
                            <input
                                type='checkbox'
                                className='hidden'
                                value={horario}
                                name={horario}
                                id={horario}
                                // onClick={ (e) => console.log('clicked an horario: ', horario)}
                                onChange={() => handleCheckboxChange(horario)}
                            />
                        </label>
                    </li>
                );
                    

                    // <li className="p-2 pl-5" onClick={ (e) => console.log('clicked an horario: ', horario)}>
                    //     <p>{horario}</p>
                    // </li>
            });
		}
		else {
			return (
				<li className="p-2 pl-5 bg-slate-300 ">
				    <p>Aún no hay horarios disponibles para este día</p>
				</li>
			);
		}
	};
    
    if(!show) return null;

    return (
        <Fragment>
            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative w-5/6 max-h-screen'>
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
                        <Calendar
                            locale={'es-ES'}
                            className={'rounded-md border-transparent'}
                            onChange={onChange}
                            value={date}
                            minDate={new Date()}
                        />
						<p>Tafira por hora: ${cuidador.hourly_rate}</p>
						<p className='text-center'>Horarios disponibles para el dia {date.toLocaleDateString("en-GB")}</p>
						<ul className="flex flex-col w-full rounded-md max-h-44 overflow-scroll">
							{console.log('date: ', date)}
							{/* {console.log('formatted date: ', formattedDate)} */}
							{renderHorarios()}
						</ul>
                        {horariosDisponibles && horariosDisponibles[formattedDate] && horariosDisponibles[formattedDate].length > 0 && (
                            <button 
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={ () => setDisplayPaymentMethodModal(true) }
                            >
                                Crear contrato para este día
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {  displayCreateContractMessage && contractResponseError === true  &&(
                <div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
                    <div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
                        <button onClick={ closeContractResponseModal } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <p className='font-bold text-2xl text-white'>Error!</p>
                        <p className='text-white text-center font-medium'>{ createContractMessage }</p>
                        <FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
                        <button
                            className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
                            onClick={ closeContractResponseModal }
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
            {  displayPaymentMethodModal === true && (
                <div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
                    <div className='bg-gray-700 px-5 py-8 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
                        <button onClick={ closePaymentMethodModal } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <p className='font-bold text-xl text-white text-center mb-3'>Elija el metodo de pago</p>
                        { paymentMethods.map(payment_method => payment_method.enabled ? (
                            <div
                                className={`w-full p-3 rounded-lg flex flex-row items-center gap-5 ${chosenPaymentMethod === payment_method.name ?  'bg-green-700' : 'bg-gray-800'}`}
                                onClick = { () => handleChosenPaymentMethod(payment_method.name) }
                            >
                                {payment_method.name === 'Mercado Pago' ? (
                                    <>
                                        {/* <input type="radio" name="mercado_pago" value="mercado_pago"></input> */}
                                        <FontAwesomeIcon icon={faHandshake} size="xl" className='text-xl' style={{color: "#fff",}} />
                                    </>

                                ): ''}
                                {payment_method.name === 'Efectivo' ? (
                                    <>
                                        {/* <input type="radio" name="efectivo" value="efectivo"></input> */}
                                        <FontAwesomeIcon icon={faMoneyBillWave} size="xl" className='text-xl' style={{color: "#fff",}} />
                                    </>

                                ): ''}
                                <p className='text-white font-semibold'>{payment_method.name}</p>
                            </div>
                        ): '')

                        }
                        <p className='text-white text-center font-medium'>{ createContractMessage }</p>
                        <button
                            disabled={chosenPaymentMethod === ''}
                            className='bg-gray-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
                            onClick={ createContract }
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
            {  displayCreateContractMessage && contractResponseError === false && (
                <div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
                    <div className='bg-green-400 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
                        <button onClick={ closeContractResponseModal } type="button" className="absolute top-2 right-2 text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <p className='font-bold text-2xl text-white'>Contrato creado!</p>
                        <p className='text-white text-center font-medium'>{ createContractMessage }</p>
                        <FontAwesomeIcon icon={faCircleCheck} size="2xl" className='text-8xl' style={{color: "#fff",}} />
                        <button
                            className='bg-green-600 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
                            onClick={ closeContractResponseModal }
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default VerDisponibilidad;