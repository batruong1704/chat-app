import {BASE_API_URL} from "../../Config/Api";
import {LOGOUT, REQ_USER, UPDATE_USER} from "./ActionType";

export const register = (data) => async(dispatch) => {
    try {
        // console.log("Gửi yêu cầu đăng ký với dữ liệu:", data);
        const res = await fetch(`${BASE_API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("Registration failed:", errorData);
            throw new Error(errorData);
        }

        const reqData = await res.json();
        // console.log("Registration successful:", reqData);

        if (reqData.jwt) {
            localStorage.setItem("token", reqData.jwt);
        }

        dispatch({
            type: "REGISTER",
            payload: reqData
        });
    } catch (error) {
        console.error("Registration error:", error);
        // Xử lý lỗi tại đây
    }
}

export const login = (data) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const reqData = await res.json();
        // console.log("Login: ", reqData);
        if (reqData.jwt) {
            localStorage.setItem("token", reqData.jwt);
        }
        dispatch({
            type: "LOGIN",
            payload: reqData
        })
    } catch (error) {
        console.log("Error for login: ", error);
    }
}

export const currentUser = (token) => async(dispatch) => {
    // console.log("Token: ", token);
    try {
        const res = await fetch(`${BASE_API_URL}/users/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const reqData = await res.json();
        // console.log("Current User: ", reqData);
        dispatch({
            type: "REQ_USER",
            payload: reqData
        })
    } catch (error) {
        console.log("Error for get Current User: ", error);
    }
}

export const searchUser = (data) => async(dispatch) => {
    try {
        console.log("Search: ", data)
        const res = await fetch(`${BASE_API_URL}/users/search?name=${data.key}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`
            }
        })
        const reqData = await res.json();
        // console.log("Search User: ", reqData);
        dispatch({
            type: "SEARCH_USER",
            payload: reqData
        })
    } catch (error) {
        console.log("Error for Search User: ", error);
    }
}

export const updateUser = (data) => async(dispatch) => {
    try {
        const res = await fetch(`${BASE_API_URL}/users/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`
            },
            body: JSON.stringify(data.data)
        })
        const reqData = await res.json();

        if (reqData.success) {
            dispatch(currentUser(data.token));
        }
        dispatch({
            type: UPDATE_USER,
            payload: reqData
        })
        return reqData;
    } catch (error) {
        console.log("Error for Update User: ", error);
    }
}

export const logoutAction = () => async(dispatch) => {
    // console.log("Đang remove token");
    localStorage.removeItem("token");
    dispatch({
        type: LOGOUT,
        payload: null
    })
    dispatch({
        type: REQ_USER,
        payload: null
    })

}