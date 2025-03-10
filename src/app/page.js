"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

export default function Home() {

  const [toggle, setToggle] = useState(false)
  const [actionStatus, setActionStatus] = useState("add")
  const [updateId, setUpdateId] = useState(0)
  const [updateObj, setUpdateObj] = useState({})

  const handleToggle = () => {
    setToggle(toggle => !toggle)
    setActionStatus("add")
    // reset()
  }


  return (
    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 3000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <div className="w-full min-h-screen bg-blue-50">
        <div className="w-full bg-blue-400 h-[65px] px-10 flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">BookNet Library</h2>
          <button onClick={handleToggle} className={`border border-2 boder-white rounded-md px-2 py-1 text-white hover:bg-white hover:text-blue-600 active:scale-95 outline-none 
          ${toggle ? "bg-gray-400" : ""} 
          ${toggle ? "text-black" : ""}`}>Add Book</button>

        </div>
        {
          toggle &&
          <BookForm setActionStatus={setActionStatus} actionStatus={actionStatus} updateObj={updateObj} updateId={updateId}></BookForm>
        }
        {
          !toggle &&
          <BookList setActionStatus={setActionStatus} setUpdateObj={setUpdateObj} handleToggle={handleToggle} setUpdateId={setUpdateId}></BookList>
        }
      </div>



    </>
  );
}

