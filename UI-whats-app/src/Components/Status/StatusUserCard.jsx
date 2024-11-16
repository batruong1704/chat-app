import React from 'react'
import {useNavigate} from "react-router-dom";

const StatusUserCard = () => {
    const navigate = useNavigate();

    const handleNavigate=()=> {
        navigate(`/status/{userId}`);
    }

  return (
    <div onClick={handleNavigate} className="flex items-center p-3 cursor-pointer">
        <div>
            <img
                className="h-7 w-7 rounded-full lg:w-10"
                src="https://th.bing.com/th/id/R.7f522ccc28c7b41942117626cbd86c43?rik=C1IgdWHZTKw7mQ&pid=ImgRaw&r=0" alt=""/>
        </div>
        <div className="ml-2 text-white">
            <p>Dogs</p>
        </div>
    </div>
  )
}

export default StatusUserCard