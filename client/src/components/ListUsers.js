import React, { Fragment, useEffect, useState } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import AddUser from './AddUser';
import User from './User';
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
            <AddUser users={users} setUsers={setUsers}/>
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

                        <User 
                            user={user}
                            users={users}
                            setUsers={setUsers}
                            deleteUser = {deleteUser}
                            key={user.id}
                        />
                        
                    ))}
                </tbody>
            </table>
        </Fragment>
    );
}

export default ListUsers;