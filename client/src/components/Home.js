import React, { Fragment, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
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
            .then(response => response.json())
            .then(result => {
                console.log('there is a result: ');
                console.log(result);
                if(result.user.id){
                    console.log('login returns the user: ');
                    console.log(result.user);
                    navigate('/users');
                }
            });

        // console.log(response.json());
        
        // setUsers(newUser.id ? [...users, newUser] : users);
        // window.location = '/';
    }
    catch (error) {
        console.error (error.message);
    }
  };

  return (
    <Fragment>
      <form className="space-y-5 p-10 my-20 mx-auto flex flex-col justify-center items-center bg-gray-100 min-w-70 w-96 rounded-md bg-slate-200">
        <h4 className="">Cuidar</h4>
        <h4>Haciendo tu vida más simple</h4>
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
        <a className="text-cyan-500 ml-auto font-bold text-md" href="">
          Olvidaste tu contraseña?
        </a>
        <button 
            type="submit"
            className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={ (e) => { loginUser(e) }}
        >
            Iniciar sesión
        </button>
        <div className="flex flex-row w-full justify-between">
            <p>No tienes una cuenta?</p>
            <a className="text-cyan-500 font-bold" href="">Crear cuenta</a>
        </div>

      </form>

    </Fragment>
    
  )
}

export default Home;