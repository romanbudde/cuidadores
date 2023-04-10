import React, { Fragment, useContext, useState, useEffect } from 'react';

import EditUser from './EditUser';



const User = ({ user, users, setUsers, disableUser, enableUser }) => {

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
            <td className='p-2'>{user.name}</td>
            <td className='p-2'>{user.last_name}</td>
            <td className='p-2'>{user.mail}</td>
            <td className='p-2'>{user.type}</td>
            <td className='p-2'>{user.created_at}</td>
            <td className='p-2'>{user.modified_at}</td>
            { user.enabled ? (
                <td className='p-2 font-semibold text-green-500'>Enabled</td>
                ) : (
                <td className='p-2 font-semibold text-orange-400'>Disabled</td>
            )}
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
                    onClose={handleClose}
                />
            </td>
            <td className='p-2'>
                {
                    user.enabled ? (
                        <button
                            className='bg-transparent hover:bg-red-500 text-red-600 font-semibold hover:text-white py-2 px-4 border border-red-600 hover:border-transparent rounded'
                            onClick={() => disableUser(user.id)}
                        >
                            Disable
                        </button>

                    ) : (
                        <button
                            className='bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded'
                            onClick={() => enableUser(user.id, user)}
                        >
                            Enable
                        </button>
                    )
                }
            </td>
        </tr>
    )
}

export default User;