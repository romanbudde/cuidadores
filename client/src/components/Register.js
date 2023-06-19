import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';
// import { Autocomplete } from '@lob/react-address-autocomplete';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import '../css/autocomplete.css';


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

  function onPlaceSelect() {
    console.log('onPlaceSelect');
  }
 
  function onSuggectionChange() {
    console.log('onSuggestionChange');
  }

//   const onAddressSelect = (e) => {
// 	console.log('event target: ', e.target);
//   }

//   const onPlaceSelect = () => {
// 	console.log('onPlaceSelect: ');
//   }

//   const onSuggestionChange = () => {
// 	console.log('onSuggestionChange');
//   } 
  const onSubmitUser = async (e) => {
    console.log('----------------- on function onSubmitUser -------------- ');



    e.preventDefault();
    try {
        const body = {email, firstname, lastname, password, address};

        console.log(JSON.stringify(body));
        console.log('---- end of body to be submitted ----');
        let newUser = {};
        const response = await fetch("http://localhost:5000/register/", {
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
                if(result.user.id){
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

                    switch(newUser.type){
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
        console.error (error.message);
    }
  } 

  return (
    <Fragment>
      <form className="min-w-70 w-96 rounded-md">
        <div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
          <h1 className='flex justify-center font-bold text-lg py-4'>Cuidar</h1>
        </div>
        <div className='gap-2 px-10 py-5 mx-auto flex flex-col justify-center items-center'>
			<h4 className='w-full text-center font-semibold mb-3 text-gray-500'>Crea tu cuenta</h4>
			<div className='flex flex-col w-full'>
				<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
					Email
				</label>
				<input
					type="email"
					name="email"
					className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
					placeholder="youremail@email.com"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
					Contraseña
				</label>
				<input
					type="password"
					name="password"
					className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
					value={password}
					placeholder="•••••••••"
					onChange={e => setPassword(e.target.value)}
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
					Nombre
				</label>
				<input
					type="text"
					name="firstname"
					className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
					placeholder="ej: Pedro"
					value={firstname}
					onChange={e => setFirstname(e.target.value)}
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
					Apellido
				</label>
				<input
					type="text"
					name="lastname"
					className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
					value={lastname}
					placeholder="ej: Gomez"
					onChange={e => setLastname(e.target.value)}
					required
				/>
			</div>
			{/* <Autocomplete apiKey="test_pub_9fd4d84a5e6a3603f999ef25a14e6a5" /> */}
			<div className='flex flex-col w-full'>
				<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
					Dirección
				</label>
				<input
					type="text"
					name="address"
					className="bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white  bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0"
					value={address}
					placeholder="ej: Mendoza 555, Rosario, Santa Fe"
					onChange={e => setAddress(e.target.value)}
					required
				/>
			</div>
			<GeoapifyContext apiKey="d68af4a0d6274d44bb3da5a6d50c40a9">
				<GeoapifyGeocoderAutocomplete placeholder="Ingrese su dirección"
					lang={"es"}
					countryCodes={'ar'}
					debounceDelay={'1500ms'}
					// type={"street"}
					// position={position}
					// countryCodes={countryCodes}
					// limit={limit}
					placeSelect={onPlaceSelect}
					select={onPlaceSelect}
					suggestionsChange={onSuggectionChange}
					onClose={(e) => {console.log('onclose')}}
					onPlaceSelected={(place) => {
						console.log("place is: ", place);
					}}
					onPlaceSelect={(place) => {
						console.log("place is: ", place);
					}}
					onOpen={(e) => console.log('onOpen')}
					onClick={(e) => { 
						onPlaceSelect();
					}}
					preprocessingHook={(e) => {console.log('preProcessingHook;')}}
					// suggestionsChange={onSuggestionChange}
					onUserInput={() => {console.log('user input')}}
					// suggestionsChange={onSuggectionChange}
				/>
			</GeoapifyContext>
			<button 
				type="submit"
				className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
				onClick={ (e) => { onSubmitUser(e); }}
			>
				Crear cuenta
			</button>
        </div>
      </form>

    </Fragment>
    
  )
}

export default Register;