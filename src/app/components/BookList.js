"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher";


export default function BookList({setActionStatus,setUpdateObj,handleToggle,setUpdateId}) {

    const {data,error,isLoading} = useSWR('/api/book',fetcher)
    const book = data?.message || [];
    

    const recordsPerpage = 5
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(book.length / recordsPerpage)
    const paginatedBooks = book.slice((currentPage - 1) * recordsPerpage, currentPage * recordsPerpage)

    const onUpdateBook = (book) =>{
        handleToggle()
        setActionStatus('update')
        setUpdateObj(book)
        setUpdateId(book.bookId)
        
    }
 
    const onDeleteBook=(bookId)=>{
        setTimeout(async() => {
            let formData ={
                pid:bookId
            }
            const res = await axios.delete('/api/book',{data:formData})
            const resData = res.data
            if(resData.status){
                toast.success(resData.message)
                mutate('/api/book')
            } else{
                toast.error(resData.message)
            }
            
        }, 1200);
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

            <div className="w-[90%] my-12 mx-auto p-1 rounded bg-transparent overflow-hidden ">
                <table className="border overflow-hidden rounded-md border-collapse w-full h-full">
                    <thead className="w-full bg-blue-400 ">
                        <tr>
                            <th className="text-md font-semibold text-white p-2">#</th>
                            <th className="text-md font-semibold text-white p-2">Book Name</th>
                            <th className="text-md font-semibold text-white p-2">Author Name</th>
                            <th className="text-md font-semibold text-white p-2">Publish Year</th>
                            <th className="text-md font-semibold text-white p-2">Language</th>
                            <th className="text-md font-semibold text-white p-2">Price</th>
                            <th className="text-md font-semibold text-white p-1">No Of Copies</th>
                            <th className="text-md font-semibold text-white p-2"> Image</th>
                            <th className="text-md font-semibold text-white p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginatedBooks.length === 0 ? (
                                <tr className="border border-bottom border-b-2 border-blue-300">
                                    <td colSpan={8} className="text-md text-center p-2 capitalize">No books found.</td>

                                </tr>
                            ) : (
                                paginatedBooks.map((item, index) => {
                                    return (
                                        <tr key={index} className="border border-bottom border-b-2 border-blue-300">
                                            <td className="text-md text-center p-2 capitalize">{item.bookId}</td>
                                            <td className="text-md text-center p-2 capitalize">{item.bookName}</td>
                                            <td className="text-md text-center p-2 capitalize">{item.bookAuthor}</td>
                                            <td className="text-md text-center p-2 capitalize">{item.publishYear}</td>
                                            <td className="text-md text-center p-2 capitalize">{item.lauguage}</td>
                                            <td className="text-md text-center p-2 capitalize">Rs. {item.price}</td>
                                            <td className="text-md text-center p-2">{item.Bookprice} no.</td>
                                            <td className="text-md text-center p-2">
                                                <img className="w-[60px] h-[45px] cursor-pointer rounded mx-auto" src={`http://localhost:3000${item.bookImage}`} />
                                            </td>
                                            {/* <td className="text-md text-center p-2">{item.createdAt}</td> */}
                                            <td className="text-md text-center p-2 capitalize flex items-center justify-center gap-5">
                                                <button onClick={() => onUpdateBook(item)} className="py-1 px-3 text-white bg-green-500 border  border-green-500 rounded-md active:scale-95 hover:bg-white hover:text-green-500  ">Edit</button>
                                                <button onClick={() => onDeleteBook(item.bookId)} className="py-1 px-2 text-white bg-red-500 border  border-red-500 rounded-md active:scale-95 hover:bg-white hover:text-red-500 ">Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )
                        }
                    </tbody>
                </table>

                {
                    totalPages > 1 &&
                    <div className="flex item-center justify-between mt-4">
                        <button onClick={() => setCurrentPage(currentPage => currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-sky-500 text-white rounded cursor-pointer disabled:bg-sky-300 disabled:cursor-not-allowed">Previous</button>
                        <p>{`Page ${currentPage} of ${totalPages}`}</p>
                        <button onClick={() => setCurrentPage(currentPage => currentPage + 1)} disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-sky-500 text-white rounded cursor-pointer disabled:bg-sky-300 disabled:cursor-not-allowed">Next</button>
                    </div>
                }

            </div>

        </>
    )
}