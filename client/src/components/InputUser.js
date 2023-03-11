import React, { Fragment, useState } from 'react';

const InputUser = () => {

    const [description, setDescription] = useState('');

    const onSubmitUser = async (e) => {
        e.preventDefault();
        try {
            const body = {description};
            console.log('description' + description);
            const response = await fetch("http://localhost:5000/cuidadores/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            window.location = '/';
            // console.log(response);
        }
        catch (error) {
            console.error (error.message)
        }
    }

    return (
        <Fragment>
            <h1 className='text-3xl text-center mt-10'>Input a new user</h1>
            <form className='flex justify-center' onSubmit={onSubmitUser}>
                <div className='mt-10 flex justify-center items-center gap-5'>
                    <input
                        className='border-2 border-slate-400 rounded-md p-2'
                        type="text"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <button 
                        className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                    >
                        Add
                    </button>
                </div>
            </form>
        </Fragment>    
    );
}

export default InputUser;