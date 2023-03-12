import React, { Fragment, useContext, useState, useEffect } from 'react';

import EditUser from './EditUser';



const User = ({ user, users, setUsers, deleteUser }) => {

    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    // useEffect(() => {
    //     handleClose()
    // }, [user])

    return (
        <tr key={user.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
            <td className='p-2'>{user.id}</td>
            <td className='p-2'>{user.description}</td>
            <td className='p-2'>
                <button
                    className='bg-transparent hover:bg-blue-500 text-blue-600 font-semibold hover:text-white py-2 px-4 border border-blue-600 hover:border-transparent rounded'
                    onClick={handleShow}
                >
                    Edit
                </button>
                <EditUser
                    user={user}
                    users={users}
                    setUsers={setUsers}
                    show={showEditModal}
                    onHide={handleClose}
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
    )
}

export default User;