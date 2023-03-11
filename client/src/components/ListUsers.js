import React, { Fragment, useEffect, useState } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

import EditUser from './EditUser';

const ListUsers = () => {

    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);

    const toggleModal = () => {
        setShowEditModal(!showEditModal);
    }

    // delete user function
    const deleteUser = async (id) => {
        try {
            const deleteUser = await fetch(`http://localhost:5000/cuidadores/${id}`, {
                method: "DELETE"
            });

            setUsers(users.filter( user => user.id !== id));
        } catch (error) {
            console.error(error.message);
        }
    }

    // get all users function
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/cuidadores/");
            const jsonData = await response.json();
            console.log(jsonData);

            setUsers(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Fragment>
            <table className='w-full text-sm text-gray-500 dark:text-gray-400 mt-10 text-center'>
                <thead className='text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th>User ID</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Use a white background for odd rows, and slate-50 for even rows */}
                    {users.map( user => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                            <td className='p-2'>{user.id}</td>
                            <td className='p-2'>{user.description}</td>
                            <td className='p-2'>
                                <button
                                    className='bg-transparent hover:bg-blue-500 text-blue-600 font-semibold hover:text-white py-2 px-4 border border-blue-600 hover:border-transparent rounded'
                                    onClick={toggleModal}
                                >
                                    Edit
                                </button>
                                <EditUser
                                    key={user.id}
                                    user={user}
                                    isVisible={showEditModal}
                                    onClose={toggleModal}
                                />
                            </td>
                            <td className='p-2'>
                                <button
                                    className='bg-transparent hover:bg-red-500 text-red-600 font-semibold hover:text-white py-2 px-4 border border-red-600 hover:border-transparent rounded'
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Disable
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default ListUsers;