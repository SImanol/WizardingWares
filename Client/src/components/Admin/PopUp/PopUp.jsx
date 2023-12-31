import React from "react";
import { GrClose } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { displayProductList, displayUsers } from "../../../redux/adminSlice";

function PopUp(props) {
    const dispatch = useDispatch();

    function handleDispatchDisplay(){
      if(props.display === 'productList') dispatch(displayProductList());
      if(props.display === 'users') dispatch(displayUsers())
    }
  return props.trigger ? (
    <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative p-8 w-1/2 h-1/3 bg-white flex flex-col rounded">
        <button className="absolute top-8 right-8" onClick={() => props.setTrigger(false)}>
          <GrClose/>
        </button>
        <div className="my-auto">{props.children}</div>
        <div className="flex justify-end">
          {
            //si tengo display como props despacho accion de display
            props.display && 
            <button onClick={handleDispatchDisplay} className="font-medium rounded-lg border-none px-4 py-2.5 text-sm md:text-base transition duration-300 ease-in-out bg-purple-600 hover:bg-purple-700 text-white">            
                Return to Dashboard            
            </button>
          }
          {
            props.handleConfirm && 
            <div>
                <button className="font-medium rounded-lg border-none px-4 py-2.5 text-sm transition duration-300 ease-in-out bg-gray-100 hover:bg-gray-200 mr-2" onClick={() => props.setTrigger(false)}>
                    Cancel
                </button>
                <button
                    className="font-medium rounded-lg border-none px-4 py-2.5 text-sm md:text-base transition duration-300 ease-in-out bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={props.handleConfirm}
                >
                    Confirm
                </button>
            </div>
          }
          
        </div>
      </div>
    </div>
  ) : null;
}

export default PopUp;