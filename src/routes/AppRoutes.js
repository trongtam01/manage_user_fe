import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import TableUsers from '../component/TableUsers'
import Home from '../component/Home'
import Login from '../component/Login'
import PrivateRoutes from './PrivateRoutes'
import NotFound from '../component/NotFound'

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/users" element={
                    <PrivateRoutes>
                        <TableUsers/>
                    </PrivateRoutes>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <PrivateRoutes path="/users">
                <TableUsers/>
            </PrivateRoutes> */}
        </>
    );
};

export default AppRoutes;