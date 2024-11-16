import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {Alert, Button, Snackbar} from "@mui/material";
import {green} from "@mui/material/colors";
import {useDispatch, useSelector} from "react-redux";
import {currentUser, login} from "../../Redux/Auth/Action";

const Signin = () => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [inputData, setInputData] = React.useState({
        email: "",
        password: ""
    });
    const dispatch = useDispatch();
    const {auth} = useSelector(store => store);

    const token = localStorage.getItem("token");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signin");
        setOpenSnackbar(true);
        dispatch(login(inputData));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (token) {
            dispatch(currentUser(token))
        }
    }, [token]);

    useEffect(() => {
        if (auth.reqData?.full_name) {
            console.log("Redirect to Home");
            navigate("/");
        }
    }, [auth.reqData]);
  return (
    <div>
        <div className="flex justify-center h-screen items-center">
            <div className="w-[30%] p-10 shadow-md bg-white">
                {/*Login Form*/}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <p className="mb-2">Email</p>
                        <input
                            placeholder="Nhập Email"
                            type="text"
                            onChange={handleChange}
                            value={inputData.email}
                            name="email"
                            className="py-2 outline-green-600 w-full rounded-md border"
                        />
                    </div>

                    <div>
                        <p className="mb-2">Password</p>
                        <input
                            placeholder="Nhập mật khẩu"
                            type="text"
                            onChange={handleChange}
                            value={inputData.password}
                            name="password"
                            className="py-2 outline-green-600 w-full rounded-md border"
                        />
                    </div>
                    <div>
                        <Button type='submit' sx={{bgcolor: green[700], padding: ".5rem 0rem"}} className="w-full" variant="contained">Đăng nhập</Button>
                    </div>
                </form>

                {/*Navigate to Register*/}
                <div className="flex space-x-3 items-center mt-5">
                    <p className="">Tạo tài khoản mới</p>
                    <Button variant="contained" onClick={() => navigate("/signup")}>Đăng ký</Button>

                </div>
            </div>
        </div>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%'}}>Thành công</Alert>
        </Snackbar>
    </div>
  )
}

export default Signin