import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const MisContratos = () => {
	const { isAuthenticated, userId } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [user, setUser] = useState([]);
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);
	console.log("user: ", user);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

    // get all users function
    const getContracts = async () => {
        try {
            console.log(`http://localhost:5000/contract?customer_id=${userId}`)
            const response = await fetch(`http://localhost:5000/contract?customer_id=${userId}`);
            const jsonData = await response.json();

            setContracts(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

    const getUserData = async () => {
		const response = await fetch("http://localhost:5000/cuidadores/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

    // when page loads, get all Users
    useEffect(() => {
        getContracts();
        getUserData();
    }, []);

    console.log('contracts');
    console.log(contracts);

	if(isAuthenticated){
		return (
			<Fragment>
                <div className='mt-10'>
                    <h1 className='flex justify-center'>Mis contratos</h1>
                    {contracts.length > 0 && (
                        contracts.map(contract => (
							<div 
								className='bg-gray-200 p-5 m-5 rounded-md flex flex-col items-start'
								key={contract.id}
							>
								<p>Estado: {contract.status === 'active' ? 'Activo' : 'Inactivo'}</p>
								<p>Total amount: ${contract.amount}</p>
								<p>Horarios: {contract.horarios.join(', ')}</p>
								{/* <button
									className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
									onClick={handleShowDisponibilidadModal(contract)}
								>
									Ver disponibilidad
								</button> */}
								{/* <VerDisponibilidad
									contract={contract}
									show={showDisponibilidadModal === contract}
									onClose={handleClose}
								/> */}
							</div>
						))
                    )}
                </div>

			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default MisContratos;