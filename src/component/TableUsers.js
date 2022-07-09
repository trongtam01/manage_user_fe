import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/UserService'
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew'
import ModalEditUser from './ModalEditUser'
import ModalConfirm from './ModalConfirm'
import _, { set } from 'lodash';
import { debounce } from 'lodash';
import { CSVLink, CSVDownload } from "react-csv";
import './TableUsers.scss'
import Papa from "papaparse";
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const TableUsers = (props) => {

    const [listUser, setListUser] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)

    const [dataUserEdit, setDataUserEdit] = useState({})
    const [dataUserDelete, setDataUserDelete] = useState({})

    const [sortBy, setSortBy] = useState("asc")
    const [sortField, setSortField] = useState("id")

    const [dataExport, setDataExport] = useState([])

    useEffect(() => {
        getUsers(1)
    }, [])

    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUser)
        let index = listUser.findIndex(item => item.id === user.id)
        cloneListUsers[index].first_name = user.first_name
        setListUser(cloneListUsers)
    }

    const handleClose = () => {
        setIsShowModalAddNew(false)
        setIsShowModalEdit(false)
        setIsShowModalDelete(false)
    }

    const handleUpdateTable = (user) => {
        setListUser([user, ...listUser])
    }

    const getUsers = async (page) => {
        let  res = await fetchAllUser(page)
        if(res && res.data) {
            setTotalUsers(res.total)
            setListUser(res.data)
            setTotalPages(res.total_pages)
        }
    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1)
    };

    const handleEditUser = (user) => {
        setDataUserEdit(user)
        setIsShowModalEdit(true)
    }

    const handleDelete = (user) => {
        setIsShowModalDelete(true)
        setDataUserDelete(user)
    }

    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUser)
        cloneListUsers = cloneListUsers.filter(item => item.id != user.id)
        setListUser(cloneListUsers)
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy)
        setSortField(sortField)
        let cloneListUsers = _.cloneDeep(listUser)
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUser(cloneListUsers)
    }

    const handleSearch = debounce((e) => {
        let term = e.target.value
        console.log("run search", term);
        if(term) {
            let cloneListUsers = _.cloneDeep(listUser)
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))
            setListUser(cloneListUsers);
        } else {
            getUsers(1)
        }
    }, 300)

    //Example Data exel
    // const csvData = [
    //     ["firstname", "lastname", "email"],
    //     ["Ahmed", "Tomi", "ah@smthing.co.com"],
    //     ["Raed", "Labes", "rl@smthing.co.com"],
    //     ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    // ];

    const getUsersExport = (e, done) => {
        let result = []
        if(listUser && listUser.length > 0) {
            //Header Exel
            result.push(["Id", "Email", "First Name", "Last Name"])
            listUser.map((item, index) => {
                let arr = []
                    arr[0] = item.id
                    arr[1] = item.email
                    arr[2] = item.first_name
                    arr[3] = item.last_name
                    result.push(arr)
            })
            setDataExport(result)
            done()
        }
    }

    const handleImportCSV = (e) => {
        if(e.target && e.target.files && e.target.files[0]) {
            let file = e.target.files[0]
            if(file.type !== "text/csv") {
                toast.error("Only Accept CSV files...")
                return;
            }
            Papa.parse(file, {
                // header: true,
                complete: function(results) {
                    let rawCSV = results.data
                    if(rawCSV.length > 0) {
                        if(rawCSV[0] && rawCSV[0].length === 3) {
                            if(rawCSV[0][0] !== "email" 
                                || rawCSV[0][1] !== "first_name"
                                || rawCSV[0][2] !== "last_name"
                            ) {
                                toast.error("Wrong format Header CSV file!")
                            } else {
                                let result = []
                                console.log("Finished:", results.data);
                                rawCSV.map((item, index) => {
                                    if(index > 0 && item.length === 3) {
                                        let obj = {}
                                        obj.id = uuidv4()
                                        obj.email = item[0]
                                        obj.first_name = item[1]
                                        obj.last_name = item[2]
                                        result.push(obj)
                                    }
                                })
                               setListUser(result)
                            }
                        } else {
                            toast.error("Wrong format CSV file!")
                        }
                    } else {
                        toast.error("Not found data CSV!")
                    }
                }
            });
        }
    }

    return (
        <>
            <div className="my-3 add-new d-sm-flex">
                <span>
                    List Users:   
                </span>
                <div className="group-btns">
                    <label htmlFor='importFile-users' className="btn btn-warning">
                         <i className="fa-solid fa-file-import"></i>
                        Import
                    </label>
                    <input
                         id='importFile-users' 
                         type="file" hidden
                         onChange={(e) => handleImportCSV(e)}
                    ></input>
                    <CSVLink
                        filename={"user.csv"}
                        className="btn btn-primary"
                        data={dataExport}
                        asyncOnClick={true}
                        onClick={getUsersExport}
                    >
                        <i className="fa-solid fa-download"></i>
                        Export
                    </CSVLink>
                    <button className="btn btn-success" 
                    onClick={() => setIsShowModalAddNew(true)}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add New User
                    </button>
                </div>
            </div>
            <div className="col-sm-4 col-12 my-3">
                <input 
                    // value={keyword}
                    onChange={(e) => handleSearch(e)}
                    className="form-control" 
                    placeholder="Search user by email..."/>
            </div>
            <div className='customize-table'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <div className="sort-header">
                                    <span>
                                        ID
                                    </span>
                                    <span>
                                        <i 
                                            className="fa-solid fa-arrow-down"
                                            onClick={() => handleSort("desc","id")}
                                        ></i>
                                        <i 
                                            className="fa-solid fa-arrow-up"
                                            onClick={() => handleSort("asc","id")}
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Email</th>
                            <th>
                                <div className="sort-header">
                                    <span>
                                        First Name
                                    </span>
                                    <span>
                                        <i 
                                            className="fa-solid fa-arrow-down"
                                            onClick={() => handleSort("desc","first_name")}
                                        ></i>
                                        <i 
                                            className="fa-solid fa-arrow-up"
                                            onClick={() => handleSort("asc","first_name")}
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <th>Last Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listUser && listUser.length > 0 &&
                            listUser.map((item, index) => {
                                return (
                                    <tr key={`users-${index}`}>
                                        <td>{item.id}</td>
                                        <td>{item.email}</td>
                                        <td>{item.first_name}</td>
                                        <td>{item.last_name}</td>
                                        <td>
                                            <button 
                                                className='btn btn-warning mx-3'
                                                onClick={() => handleEditUser(item)}
                                            >Edit</button>
                                            <button 
                                                className='btn btn-danger'
                                                onClick={() => handleDelete(item)}
                                            >Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
             </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                nextClassName='page-item'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
            />

            <ModalAddNew 
                show = {isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTable}
            />

            <ModalEditUser 
                show = {isShowModalEdit}
                dataUserEdit={dataUserEdit}
                handleClose={handleClose}
                handleEditUserFromModal={handleEditUserFromModal}
            />
            <ModalConfirm 
                show = {isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFromModal={handleDeleteUserFromModal}
            />
        </>
    );
};

export default TableUsers;