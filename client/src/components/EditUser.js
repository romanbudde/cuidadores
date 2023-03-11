import React, { Fragment, useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';

const EditUser = ({ user }) => {
    
    const [description, setDescription] = useState(user.description);

    return (
        <Fragment>
           <Button className='flex justify-center m-0'>
                Toggle modal
            </Button>
            <Modal
                show={false}
                
            >
                <Modal.Header>
                    Terms of Service
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        The European Union's General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button >
                        I accept
                    </Button>
                    <Button
                        color="gray"
                        
                    >
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default EditUser;