import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';

const Register = () => {

  const cookies = new Cookies();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { userId, setUserId } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');


  const onSubmitUser = async (e) => {
    console.log('----------------- on function onSubmitUser -------------- ');
    e.preventDefault();
    try {
        const body = {email, firstname, lastname, password};

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
      <form className="space-y-5 p-10 my-20 mx-auto flex flex-col justify-center items-center bg-gray-100 min-w-70 w-96 rounded-md bg-slate-200">
        <h4 className="text-center">Cuidar</h4>
        <h4></h4>
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
                Password
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
              First Name
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
                Last Name
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
        <button 
            type="submit"
            className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={ (e) => { onSubmitUser(e); }}
        >
          Crear cuenta
        </button>
      </form>

    </Fragment>
    
  )
}

export default Register;