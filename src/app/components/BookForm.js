"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";



export default function BookForm({setActionStatus,actionStatus,updateObj,updateId}) {
    const { register, handleSubmit, setFocus, setValue, reset } = useForm()
    const [isLoading, setLoading] = useState(false)
    // const [actionStatus, setActionStatus] = useState("add")

    const onBookSubmit = (data) => {
        if (actionStatus === 'add') {
            console.group(data)
            setLoading(true)
            setTimeout(async () => {
                const formData = new FormData()
                formData.append('bookName', data.bookName)
                formData.append('bookAuthor', data.bookAuthor)
                formData.append('lauguage', data.lauguage)
                formData.append('publishYear', data.publishYear)
                formData.append('price', data.price)
                formData.append('Bookprice', data.Bookprice)
                formData.append('bookImage', data.bookImage[0])

                const res = await axios.post('/api/book', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const resData = res.data
                setLoading(false)
                if (resData.status) {
                    toast.success("Book added successfully...!!")
                    reset()
                    setActionStatus("add")
                } else {
                    toast.error(resData.message)
                }

            }, 1200);
        } else {
            console.log(data)
            setLoading(true)
            setTimeout(async () => {
                let formData = {
                    pid: updateId,
                    bookName: data.bookName,
                    bookAuthor: data.bookAuthor,
                    lauguage: data.lauguage,
                    publishYear: data.publishYear,
                    price: data.price,
                    Bookprice: data.Bookprice
                }
                const res = await axios.put('/api/book', formData)
                const resData = res.data
                setLoading(false)
                if (resData.status) {
                    toast.success("Book updated successfully...!!")
                    reset()
                    setActionStatus("add")
                } else {
                    toast.error(resData.message)
                }

            }, 1200);
        }
    }

    useEffect(()=>{
        setFocus("bookName")
        if(actionStatus === "add"){
            reset()
        } else if (actionStatus === 'update'){
            setValue('bookName',updateObj.bookName)
            setValue('bookAuthor',updateObj.bookAuthor)
            setValue('publishYear',updateObj.publishYear)
            setValue('lauguage',updateObj.lauguage)
            setValue('price',updateObj.price)
            setValue('Bookprice',updateObj.Bookprice)
        }
    },[]);

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

            <div className="w-[500px] py-3 px-5 bg-white rounded my-10 mx-auto shadow-lg">

                <form onSubmit={handleSubmit(onBookSubmit)} autoComplete="off">
                    <div className="w-full h-[60px] flex items-center justify-center">
                        <h2 className="text-xl mb-5 font-bold text-blue-600 text-center m-3">{actionStatus === "update" ? "Update Book" : "Add Book"}</h2>
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Book Name :</label>
                        <input {...register('bookName')} required disabled={isLoading} type="text" className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Book Author :</label>
                        <input  {...register('bookAuthor')} required disabled={isLoading} type="text" className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Publication Year :</label>
                        <input  {...register('publishYear')} required disabled={isLoading} type="date" className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Language :</label>
                        <input  {...register('lauguage')} required disabled={isLoading} type="text" className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Book Price :</label>
                        <input  {...register('price')} required disabled={isLoading} className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" type="text" step="any" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Available Copies :</label>
                        <input  {...register('Bookprice')} required disabled={isLoading} className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" type="text" step="any" />
                    </div>
                    <div className="w-full mb-3 flex items-center justify-start gap-x-4">
                        <label className="w-[33%] text-end">Book Image :</label>
                        <input  {...register('bookImage')} disabled={isLoading} className="w-[70%] mt-1 p-1 rounded border border-2 border-gray-500 outline-none focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300" type="file" accept="image/png,image/gif,image/jpeg,image/avif,image/webp" />
                    </div>
                    <button disabled={isLoading} type="submit" className="disabled:cursor-not-allowed disabled:bg-blue-300  w-full bg-blue-500 mb-5 mt-5 text-white p-2 rounded-lg hover:bg-blue-800 transition duration-250">{actionStatus === "update" ? (isLoading ? "Updating..." : "Update Book") : (isLoading ? "Adding" : "Add Book")}</button>
                </form>
            </div>

        </>

    )
}