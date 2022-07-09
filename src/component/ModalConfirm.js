import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { deleteUser } from '../services/UserService'
import { toast } from 'react-toastify';

const ModalConfirm = (props) => {

    const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } = props

    const handleDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        if(res && +res.statusCode === 204) {
            handleClose()
            toast.success("Delete User Success")
            handleDeleteUserFromModal(dataUserDelete)
        } else {
            toast.error("Error not working!!!")
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
                <Modal.Title>Delete A Uses</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="body-add-new">
                        Do want to delete this user, 
                        <b>
                            email = "{dataUserDelete.email}"?
                        </b>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleDelete()}>
                    Cofirm delete
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalConfirm;