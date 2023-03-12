import React, { Fragment, useState } from 'react';

const AddUser = ( {users, setUsers, show, onClose} ) => {

    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');

    const onSubmitUser = async (e) => {
        console.log('----------------- onSubmitUser -------------- ');
        e.preventDefault();
        try {
            const body = {description};
            let newUser = {};
            const response = await fetch("http://localhost:5000/cuidadores/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result.id){
                        console.log('add user result: ');
                        console.log(result);
                        newUser = result;
                    }
                });

            // console.log(response.json();

            setUsers(newUser.id? [...users, newUser] : users);
            // window.location = '/';
        }
        catch (error) {
            console.error (error.message);
        }
    }

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
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add new user
                            </h3>
                            
                        </div>
                        <form className="space-y-6">
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={ (e) => {
                                    onSubmitUser(e);
                                    onClose(); 
                                }}
                            >
                                Add user
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AddUser;