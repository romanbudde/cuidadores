import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';

const Home = () => {
	
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { userId, setUserId } = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [credentialsErrorMessage, setCredentialsErrorMessage] = useState(false);
	const navigate = useNavigate();
	const cookies = new Cookies();
  
    const loginUser = async (e) => {
		console.log('----------------- onLoginUser -------------- ');
		e.preventDefault();
		try {
			const body = {email, password};
			console.log(JSON.stringify(body));
			console.log('---- end of body to be submitted ----');
			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
				.then(response => {
					console.log(response);
					if(!response.ok) {
						// console.log('CREDENTIALS ERROR');
						setCredentialsErrorMessage(true);
					}

					return response.json();
				})
				.then(result => {
					console.log('there is a result: ');
					console.log(result);
					if(result){
						console.log('login returns the token: ');
						console.log(result);

						// set the cookie
						cookies.set('auth-token', result.auth_token, { path: '/' });
						
						// set global context for isAuthenticated to true.
						setIsAuthenticated(true);
						
						// set global context for userId
						cookies.set('user-id', result.user_id, { path: '/' });
						setUserId(result.user_id);

						// redirect a landing de user o de cuidadores o de admin segun el tipo de usuario.
						console.log('user type: ', result.user_type);

						switch(result.user_type){
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

			// console.log(response.json());
			
			// setUsers(newUser.id ? [...users, newUser] : users);
			// window.location = '/';
		}
		catch (error) {
			console.error(error);
			// console.error (error.message);
		}
    };

	return (
		<Fragment>
		<form className="min-w-70 w-96 rounded-md">
			<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
				<h1 className='flex justify-center font-bold text-lg py-4'>Cuidar</h1>
			</div>
			<div className='space-y-2 p-10 mx-auto flex flex-col justify-center items-center'>
				<div className='w-full pb-4'>
					<h1 className='text-left font-medium text-3xl mb-2 text-blue-900'>Bienvenido!</h1>
					<h4 className='text-left font-semibold mb-16 text-gray-500'>Inicia sesión con tu cuenta</h4>
					<label
						className={`${ credentialsErrorMessage ? 'block mb-1 mr-auto text-sm font-medium text-red-600 dark:text-white' : 'block mb-1 mr-auto text-sm font-medium text-gray-900 dark:text-white'}`}
					>
						Email
					</label>
					<input
						type="email"
						name="email"
						className={`${ credentialsErrorMessage ? 'bg-red-500 border text-gray-900 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-red-500 border-solid border-opacity-100 focus:outline-none focus:outline-0 placeholder-red-500' : 'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'} shadow-md`}
						placeholder="youremail@email.com"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
		
				<div className='w-full'>
					<label
						className={`${ credentialsErrorMessage ? 'block mb-1 mr-auto text-sm font-medium text-red-600 dark:text-white' : 'block mb-1 mr-auto text-sm font-medium text-gray-900 dark:text-white'}`}
					>
						Password
					</label>
					<input
						type="password"
						name="password"
						className={`${ credentialsErrorMessage ? 'bg-red-500 border text-gray-900 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-red-500 border-solid border-opacity-100 focus:outline-none focus:outline-0 placeholder-red-500' : 'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'} shadow-md`}
						value={password}
						placeholder="•••••••••"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<a className="text-cyan-500 ml-auto font-bold text-md pb-2" href="">
					Olvidaste tu contraseña?
				</a>
				{ credentialsErrorMessage && (
					<p className='w-full text-left text-red-500'>
						Email o contraseña incorrectos.
					</p>
				)}
				<button 
					type="submit"
					className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					onClick={ (e) => { loginUser(e) }}
				>
					Iniciar sesión
				</button>
				<div className="flex flex-row w-full justify-between">
					<a href="/register">No tienes una cuenta?</a>
					<a className="text-cyan-500 font-bold" href="/register">Crear cuenta</a>
				</div>
			</div>
	
		</form>
	
		</Fragment>
	)
}

export default Home;