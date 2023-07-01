import React, { Fragment, useContext, useState, useEffect } from 'react';

import EditUser from './EditUser';



const User = ({ user, users, setUsers, disableUser, enableUser }) => {

    const [showEditModal, setShowEditModal] = useState(false);
    
    console.log('users: ', users);

    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    // useEffect(() => {
    //     handleClose()
    // }, [user])

    return (
        <>
            <div
                className={`${user.status === 'enabled' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
                : user.status === 'disabled' ? 'bg-gradient-to-r from-green-500 to-green-400'
                : user.status === 'cancelled' ? 'bg-red-500'
                : 'bg-gray-700'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium`}
                key={user.id}
            >
                <p>ID: {user.id}</p>
                <p>Email: {user.mail}</p>
                <p>Nombre: ${user.name}</p>
                <p>Apellido: ${user.last_name}</p>
            </div>
            
        </>
    )
}

export default User;