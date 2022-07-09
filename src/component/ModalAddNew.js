import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { postCreateUser } from '../services/UserService'
import { toast } from 'react-toastify';

const ModalAddNew = (props) => {

    const [username, setUserName] = useState("")
    const [job, setJob] = useState("")

    const { show, handleClose, handleUpdateTable } = props

    const handleSaveUser = async () => {
        let res = await postCreateUser(username, job)
        if(res && res.id) {
            handleClose()
            setUserName("")
            setJob("")
            toast.success('A User is created success')
            handleUpdateTable({first_name: username, id: res.id})
        } else {
            handleClose()
            toast.error('A wrong...')
        }
    }

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Add New Uses</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        <div className="form-group">
                            <label>Name: </label>
                            <input 
                                value={username} 
                                onChange={(e) => setUserName(e.target.value)}
                                type="text" 
                                className="form-control"
                                placeholder="Name"/>
                        </div>
                        <div className="form-group">
                            <label>Job:</label>
                            <input 
                                value={job} 
                                onChange={(e) => setJob(e.target.value)}
                                type="text" 
                                className="form-control" 
                                placeholder="Job"/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSaveUser()}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalAddNew;