import React from 'react';
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignIn = ({ signInData, handleSignInChange, handleSignIn }) => {
    return (
        <div className="form-container sign-in-container absolute top-0 h-full w-1/2 z-2 transition-all duration-600 ease-in-out">
            <form onSubmit={handleSignIn} className="bg-white flex items-center justify-center flex-col p-[0_50px] h-full text-center">
                <h1 className="font-bold m-0 text-2xl">Đăng nhập</h1>
                <div className="social-container my-5">
                    <a href="#" className="social border border-[#DDDDDD] rounded-full inline-flex justify-center items-center m-[0_5px] h-10 w-10">
                        <FaFacebook className="size-[16px]" />
                    </a>
                    <a href="#" className="social border border-[#DDDDDD] rounded-full inline-flex justify-center items-center m-[0_5px] h-10 w-10">
                        <FcGoogle className="size-[16px]" />
                    </a>
                    <a href="#" className="social border border-[#DDDDDD] rounded-full inline-flex justify-center items-center m-[0_5px] h-10 w-10">
                        <FaLinkedin className="size-[16px]" />
                    </a>
                </div>
                <span className="text-xs">hoặc sử dụng tài khoản của bạn</span>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    className="bg-[#eee] border-none p-3 my-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className="bg-[#eee] border-none p-3 my-2 w-full"
                />
                <a href="#" className="text-sm no-underline my-4">Quên mật khẩu?</a>
                <button className="rounded-[20px] border border-[#FF4B2B] bg-[#FF4B2B] text-white text-xs font-bold py-3 px-11 uppercase tracking-wider transition-transform duration-80 ease-in">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default SignIn;