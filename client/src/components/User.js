import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditUser from './EditUser';
import UserEditData from './UserEditData';
// import MoonLoader from "react-spinners/ClipLoader";

const User = ({ user, users, setUsers, displayedUsers, setDisplayedUsers, disableUser, enableUser, loading, setLoading }) => {

    const [showEditModal, setShowEditModal] = useState(false);
    const [showModalDisableUser, setShowModalDisableUser] = useState(false);
    const [showModalEnableUser, setShowModalEnableUser] = useState(false);
    const [userToDisableEnable, setUserToDisableEnable] = useState(false);
    const [userIdToEnable, setUserIdToEnable] = useState();
    const [userToEnable, setUserToEnable] = useState();

    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    return (
        <>
            <div
                className={`${user.enabled ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-red-500 to-red-400'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium relative`}
            >
                {user.type === 0 && (
                    <p className='text-center w-full font-bold mb-3'>Cliente</p>
                )}
                {user.type === 1 && (
                    <p className='text-center w-full font-bold mb-3'>Cuidador</p>
                )}
                {user.type === 2 && (
                    <p className='text-center w-full font-bold mb-3'>Admin</p>
                )}
                
                <div className='flex flex-row w-full justify-between'>
                    <div className={`${user.enabled ? 'bg-green-700 ' : 'bg-red-700'} flex flex-row items-center gap-3 p-2 mb-3 rounded-lg shadow-md`}>
                        { user.enabled ? (
                            <FontAwesomeIcon icon={faCheck} className=''/>
                        ) : (
                            <FontAwesomeIcon icon={faCircleXmark} className=''/>
                        )}
                        <p>{user.enabled ? 'Activado' : 'Desactivado'}</p>
                    </div>
                    <div
                        className='bg-gray-700 flex flex-row items-center gap-3 p-2 mb-3 rounded-lg shadow-md'
                        onClick={handleShow}
                    >
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className=''
                        />
                        <p>Editar datos</p>
                    </div>
                    <EditUser
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        displayedUsers={displayedUsers}
                        setDisplayedUsers={setDisplayedUsers}
                        show={showEditModal}
                        onClose={handleClose}
                    />
                </div>
                <p>ID: {user.id}</p>
                <p>Email: {user.mail}</p>
                <p>Nombre: {user.name}</p>
                <p>Dni: {user.telefono}</p>
                <p>Telefono: {user.telefono}</p>
                {user.type === 1 && (
                    <p>Tarifa por media hora: ${user.hourly_rate}</p>
                )}
                <p>Apellido: {user.last_name}</p>
                <p>Dirección: {user.address}</p>
                <p>Fecha de creación: {moment(user.created_at).format('DD/MM/YYYY')}</p>

                {
                    user.enabled ? (
                        <button
                            className='bg-transparent focus:outline-none mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded'
                            // onClick={() => disableUser(user.id)}
                            onClick={() => {
                                setShowModalDisableUser(true);
                                setUserToDisableEnable(user.id);
                            }}
                        >
                            Desactivar
                        </button>

                    ) : (
                        <button
                            className='bg-transparent mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded'
                            onClick={() => {
                                setShowModalEnableUser(true);
                                setUserIdToEnable(user.id);
                                setUserToEnable(user);
                            }}
                        >
                            Activar
                        </button>
                    )
                }
                { showModalDisableUser && (
                    <div className='flex flex-col items-center justify-center fixed inset-0 bg-opacity-50 bg-gray-800 h-screen z-50'>
                        <div className='flex flex-col mx-auto relative w-5/6 overflow-y-scroll bg-gray-700 p-7 rounded-md'>
                            <p className='text-center'>
                                ¿Está seguro que desea desactivar el usuario?
                            </p>
                            <div className='w-full flex flex-row justify-between mt-7'>
                                <button
                                    className='bg-transparent focus:outline-none mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
                                    onClick={() => {
                                        setLoading(true);
                                        disableUser(userToDisableEnable);
                                        setShowModalDisableUser(false);
                                    }}
                                >
                                    Desactivar
                                </button>
                                <button
                                    className='bg-transparent focus:outline-none mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded'
                                    onClick={() => setShowModalDisableUser(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                { showModalEnableUser && (
                    <div className='flex flex-col items-center justify-center fixed inset-0 bg-opacity-50 bg-gray-800 h-screen z-50'>
                        <div className='flex flex-col mx-auto relative w-5/6 overflow-y-scroll bg-gray-700 p-7 rounded-md'>
                            <p className='text-center'>
                                ¿Está seguro que desea activar el usuario?
                            </p>
                            <div className='w-full flex flex-row justify-between mt-7'>
                                <button
                                    className='bg-transparent focus:outline-none mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-green-400 hover:border-transparent rounded'
                                    onClick={() => {
                                        setLoading(true);
                                        enableUser(userIdToEnable, userToEnable);
                                        setShowModalEnableUser(false);
                                    }}
                                >
                                    Activar
                                </button>
                                <button
                                    className='bg-transparent focus:outline-none mt-2 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-200 hover:border-transparent rounded'
                                    onClick={() => setShowModalEnableUser(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default User;