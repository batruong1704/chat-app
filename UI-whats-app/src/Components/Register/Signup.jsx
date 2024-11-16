import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {currentUser, register} from "../../Redux/Auth/Action";
import {Alert, Button, Snackbar} from "@mui/material";
import {green} from "@mui/material/colors";

const Signup = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [inputData, setInputData] = React.useState({
    full_name: "",
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const {auth} = useSelector(store => store);

  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Handle Signup with Data: \n\tFull name: " + inputData.full_name + "\n\tEmail: " + inputData.email + "\n\tPassword: " + inputData.password);
    dispatch(register(inputData));
    setOpenSnackbar(true);
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
  }

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
      <div>
        <div className="flex justify-center h-screen items-center">
          <div className="w-[30%] p-10 shadow-md bg-white">
            {/*Login Form*/}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="mb-2">Tên đầy đủ</p>
                <input
                    placeholder="Nhập tên muốn hiển thị"
                    type="text"
                    onChange={handleChange}
                    name="full_name"
                    value={inputData.full_name}
                    className="py-2 outline-green-600 w-full rounded-md border"
                />
              </div>

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
                <Button type='submit' sx={{bgcolor: green[700], padding: ".5rem 0rem"}} className="w-full"
                        variant="contained">Đăng ký</Button>
              </div>
            </form>

            {/*Navigate to Login*/}
            <div className="flex space-x-3 items-center mt-5">
              <p className="">Đã có tài khoản</p>
              <Button variant="contained" onClick={() => navigate("/signin")}>Đăng nhập</Button>

            </div>
          </div>
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%'}}>Thành công</Alert>
      </Snackbar>
    </div>
  )
}

export default Signup