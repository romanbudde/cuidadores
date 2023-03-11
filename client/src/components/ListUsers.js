import React, { Fragment, useEffect, useState } from 'react';

const ListUsers = () => {

    const [users, setUsers] = useState([]);

    // delete user function
    const deleteUser = async () => {

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

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Fragment>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-10 text-center'>
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
                                    className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                >
                                    Edit
                                </button>
                            </td>
                            <td className='p-2'>
                                <button
                                    className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
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