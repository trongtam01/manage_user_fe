import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import { handleLoginRedux } from '../redux/actions/userAction'
import { useSelector, useDispatch } from 'react-redux';


const Login = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch() 

    const isLoading = useSelector(state => state.user.isLoading)
    const dataUserRedux = useSelector(state => state.user.user)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [loadingAPI, setLoadingAPI] = useState(false)

    const handleLogin = async () => {
        if(!email || !password) {
            toast.error("Missing email or password")
            return
        }
        dispatch(handleLoginRedux(email, password))
    }

    const handlePress = (e) => {
        if(e && e.key === "Enter") {
            handleLogin()
        }
    }

    useEffect(() => {
        if(dataUserRedux && dataUserRedux.auth === true) {
            navigate("/")
        }
    }, [dataUserRedux])

    return (
        <div className="login-container col-12 col-sm-4">
            <div className="title">
                Log in
            </div>
            <div className="text">
                Email or Username (eve.holt@reqres.in) (cityslicka)
            </div>
            <input 
                type="text"
                placeholder="Email or username..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="input-2">
                <input
                    type={isShowPassword === true ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handlePress(e)}
                />
                {/* <i className="fa-solid fa-eye"></i> */}
                <i  
                    className={isShowPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                    onClick={() => setIsShowPassword(!isShowPassword)}
                ></i>
            </div>
            <button 
                className={email && password ? "active" : ""}
                disabled={email && password ? false : true}
                onClick={() => handleLogin()}
            >
                {isLoading && <i className="fas fa-sync fa-spin"></i>}
                &nbsp;Login
            </button>
            <div className="back">
                <i className="fa-solid fa-arrow-left"></i>
                <Link to="/" className="nav-link">
                    Go back
                </Link>
            </div>
        </div>
    );
};

export default Login;