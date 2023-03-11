import React, { Fragment, useEffect, useState } from 'react';

const EditUser = ({ user, isVisible, onClose }) => {
    
    const [description, setDescription] = useState(user.description);

    if(!isVisible) return null;

    const updateDescription = async (e) => {
        e.preventDefault();
        try {
            const bodyJSON = { description };
            const response = await fetch(
                `http://localhost:5000/cuidadores/${user.id}`, 
                {
                    "method": "PUT",
                    "headers": "Content-Type: application/json",
                    "body": JSON.stringify(bodyJSON)
                }
            );

            window.location = '/';

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
            {/* <h5>Edit user</h5> */}

            <div className='fixed inset-0 bg-black-500 z-50 flex justify-center items-center backdrop-opacity-50'>
                <div className='flex flex-col'>
                    <button className='text-black text-xl place-self-end' onClick={ () => onClose }> 
                    X
                    </button>
                    <div className='bg-white p-2 rounded flex flex-col gap-5'>
                        <input 
                            className='rounded'
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <button 
                            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                            onClick={(e) => updateDescription(e)}
                        >
                            Save user
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditUser;