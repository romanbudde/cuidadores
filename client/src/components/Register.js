import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';
// import { Autocomplete } from '@lob/react-address-autocomplete';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";
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

  const SignupSchema = Yup.object().shape({
	firstname: Yup.string()
	  .min(2, 'Too Short!')
	  .max(50, 'Too Long!')
	  .required('Required'),
	lastname: Yup.string()
	  .min(2, 'Too Short!')
	  .max(50, 'Too Long!')
	  .required('Required'),
	password: Yup.string()
	  .min(8, 'La contraseña debe ser mayor a 8 caracteres de largo!')
	  .max(50, 'La contraseña es demasiado larga')
	  .matches(/^[a-zA-Z0-9]{8,}$/, 'La contraseña tiene que contener solamente números y/o letras!.')
	  .required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
  });

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
  const onSubmitUser = async () => {
    console.log('----------------- on function onSubmitUser -------------- ');



    // e.preventDefault();
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
      {/* <form className="min-w-70 w-96 rounded-md"> */}
	  <Formik
		initialValues={{
			firstname: '',
			lastname: '',
			password: '',
			address: '',
			email: '',
		}}
		validationSchema={SignupSchema}
		onSubmit={onSubmitUser}
      >
		{({ errors, touched }) => (
			<Form>
				<div className='gap-2 px-10 py-5 mx-auto flex flex-col justify-center items-center'>
					<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
						<h1 className='flex justify-center font-bold text-lg py-4'>Cuidar</h1>
					</div>
					<Field name="firstname" placeholder="Nombre" />
						{errors.firstname && touched.firstname ? (
							<div>{errors.firstname}</div>
						) : null}
					<Field name="lastname" placeholder="Apellido" />
						{errors.lastname && touched.lastname ? (
							<div>{errors.lastname}</div>
						) : null}
					<Field name="email" type="email" placeholder="Email" />
						{errors.email && touched.email ? <div>{errors.email}</div> : null}
						<button type="submit">Submit</button>
					<Field name="email" type="email" placeholder="Contraseña" />
						{errors.email && touched.email ? <div>{errors.email}</div> : null}
						<button type="submit">Submit</button>
					<Autocomplete
						apiKey={'AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4'}
						debounce={'3000ms'}
						className='bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'
						style={{ width: "100%" }}
						onPlaceSelected={(place) => {
							console.log(place);
							console.log('formated address: ', place.formatted_address);
							setAddress(place.formatted_address);
						}}
						options={{
							types: ["address"],
							componentRestrictions: { country: "ar" },
						}}
						defaultValue=""
					/>
					<button 
						type="submit"
						className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
						onClick={ (e) => { onSubmitUser(e); }}
					>
						Crear cuenta
					</button>
				</div>
			</Form>
        )}
	  </Formik>

    </Fragment>
    
  )
}

export default Register;