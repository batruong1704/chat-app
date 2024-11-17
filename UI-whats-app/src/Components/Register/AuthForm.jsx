import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { currentUser, login, register } from "../../Redux/Auth/Action";
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const token = localStorage.getItem("token");

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [signInData, setSignInData] = useState({
        email: "",
        password: ""
    });

    const [signUpData, setSignUpData] = useState({
        full_name: "",
        email: "",
        password: ""
    });

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log("Signin");
        setOpenSnackbar(true);
        dispatch(login(signInData));
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Handle Signup with Data: \n\tFull name: " + signUpData.full_name + "\n\tEmail: " + signUpData.email + "\n\tPassword: " + signUpData.password);
        dispatch(register(signUpData));
        setOpenSnackbar(true);
    };

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (token) {
            dispatch(currentUser(token))
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (auth.reqData?.full_name) {
            console.log("Redirect to Home");
            navigate("/");
        }
    }, [auth.reqData, navigate]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#f6f5f7] font-['Montserrat']">
            <div className={`container bg-white rounded-[10px] shadow-[0_14px_28px_rgba(0,0,0,0.25)] relative overflow-hidden w-[768px] min-h-[480px] ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                <SignUp
                    signUpData={signUpData}
                    handleSignUpChange={handleSignUpChange}
                    handleSignUp={handleSignUp}
                />

                <SignIn
                    signInData={signInData}
                    handleSignInChange={handleSignInChange}
                    handleSignIn={handleSignIn}
                />

                {/* Overlay Container */}
                <div className="overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100">
                    <div className="overlay bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] bg-no-repeat bg-cover text-white relative -left-full h-full w-[200%] transform translate-x-0 transition-transform duration-600 ease-in-out">
                        {/* Overlay Left Panel */}
                        <div className="overlay-panel overlay-left absolute flex items-center justify-center flex-col p-[0_40px] text-center top-0 h-full w-1/2 transform -translate-x-[20%] transition-transform duration-600 ease-in-out">
                            <h1 className="font-bold m-0 text-2xl">Welcome Back!</h1>
                            <p className="text-sm font-light leading-5 tracking-wider my-5">
                                Để giữ liên lạc với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                            </p>
                            <button
                                className="ghost rounded-[20px] border border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wider transition-transform duration-80 ease-in"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Đăng nhập
                            </button>
                        </div>

                        {/* Overlay Right Panel */}
                        <div className="overlay-panel overlay-right absolute flex items-center justify-center flex-col p-[0_40px] text-center top-0 h-full w-1/2 right-0 transform translate-x-0 transition-transform duration-600 ease-in-out">
                            <h1 className="font-bold m-0 text-2xl">Chào mừng sự trở lại!</h1>
                            <p className="text-sm font-light leading-5 tracking-wider my-5">
                                Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng tôi
                            </p>
                            <button
                                className="ghost rounded-[20px] border border-white bg-transparent text-white text-xs font-bold py-3 px-11 uppercase tracking-wider transition-transform duration-80 ease-in"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%'}}>
                    Thành công
                </Alert>
            </Snackbar>

            <style jsx>{`
                .container.right-panel-active .sign-in-container {
                    transform: translateX(100%);
                }

                .container.right-panel-active .sign-up-container {
                    transform: translateX(100%);
                    opacity: 1;
                    z-index: 5;
                    animation: show 0.6s;
                }

                .container.right-panel-active .overlay-container {
                    transform: translateX(-100%);
                }

                .container.right-panel-active .overlay {
                    transform: translateX(50%);
                }

                .container.right-panel-active .overlay-left {
                    transform: translateX(0);
                }

                .container.right-panel-active .overlay-right {
                    transform: translateX(20%);
                }

                @keyframes show {
                    0%, 49.99% {
                        opacity: 0;
                        z-index: 1;
                    }
                    50%, 100% {
                        opacity: 1;
                        z-index: 5;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthForm;