import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { putUpdateUser } from '../services/UserService'
import { toast } from 'react-toastify';

const ModalEditUser = (props) => {

    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props

    const [username, setUserName] = useState("")
    const [job, setJob] = useState("")

    const handleEditUser = async () => {
        let res = await putUpdateUser(username, job)
        if(res && res.updatedAt) {
            handleEditUserFromModal({
                first_name: username,
                id: dataUserEdit.id
            })
            handleClose()
            toast.success("Update user success")
        } 
    }

    useEffect(() => {
        if(show) {
            setUserName(dataUserEdit.first_name)
        }
    }, [dataUserEdit])

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Edit a User</Modal.Title>
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
                <Button variant="primary" onClick={() => handleEditUser()}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalEditUser;