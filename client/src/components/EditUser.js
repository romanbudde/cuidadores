import React, { Fragment, useEffect, useState } from 'react';

const EditUser = ({ user, isVisible, onClose }) => {
    
    const [description, setDescription] = useState(user.description);

    if(!isVisible) return null;

    const updateDescription = async (e) => {
        console.log(description);
        e.preventDefault();
        try {
            const bodyJSON = { description };
            const response = await fetch(
                `http://localhost:5000/cuidadores/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            );

            console.log('update response:');
            console.log(response);

            window.location = '/';

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
            {/* <h5>Edit user</h5> */}

            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5'>
                        <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit user
                            </h3>
                            
                        </div>
                        <form className="space-y-6" action="#">
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com"/>
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={description ? description : ''}
                                    onChange={e => setDescription(e.target.value)}
                                    name="description" 
                                    placeholder="The user's description"
                                    required/>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e) => { updateDescription(e)} }
                            >
                                Save user
                            </button>
                        </form>
                        {/* <input 
                            className='rounded'
                            type="text"
                            value={description ? description : ''}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <button 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                            onClick={(e) => { updateDescription(e)} }
                        >
                            Save user
                        </button> */}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditUser;