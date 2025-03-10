import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';


const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'amrutadesh',
    database: 'next_crud_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
}

async function getConnection() {
    return await mysql.createPool(dbConfig)
}

export async function POST(req) {
    let con;

    try {
        const formData = await req.formData();
        const bookName = formData.get('bookName');
        const bookAuthor = formData.get('bookAuthor');
        const publishYear = formData.get('publishYear');
        const lauguage = formData.get('lauguage');
        const price = formData.get('price');
        const Bookprice = formData.get('Bookprice');
        const bookImage = formData.get('bookImage');

        if (!bookImage || !bookImage.name) {
            return new Response(JSON.stringify({ status: false, message: 'Image not found !!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // File upload logic
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const fileURL = path.join(uploadsDir, bookImage.name);

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileBuffer = await bookImage.arrayBuffer();
        fs.writeFileSync(fileURL, Buffer.from(fileBuffer));

        const filePath = `/uploads/${bookImage.name}`;

        // Debug logs
        console.log(bookName, bookAuthor, publishYear, lauguage, price, Bookprice, filePath);

        // Database operation
        con = await getConnection();
        const sql =
            'INSERT INTO book (bookName, bookAuthor, publishYear, lauguage, price, Bookprice, bookImage, createdAt) VALUES (?,?,?,?,?,?,?,?)';
        const queryData = [
            bookName,
            bookAuthor,
            publishYear,
            lauguage,
            price,
            Bookprice,
            filePath,
            new Date().toISOString(),
        ];
        await con.execute(sql, queryData);

        return new Response(JSON.stringify({ status: true, message: 'Book Added Successfully..!!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ status: false, message: 'Internal server error !!' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        if (con) {
            con.end();
        }
    }
}


export async function GET(params) {
    try {
        const con = await getConnection()
        const sql = 'SELECT * FROM book ';
        const [data] = await con.query(sql)
        con.releaseConnection()
        return new Response(JSON.stringify({ status:true, message:data }), {
            headers: {
                'Content-type': 'application/json'
            }
        })

    }
    catch (err) {
        console.error(err)
        return new Response(JSON.stringify({ status: false, message: "Internal server error !!" }), {
            headers: {
                'Content-type': 'application/json'
            }
        })

    }
}

export async function PUT(params) {
    try{

        const {pid,bookName,bookAuthor,publishYear,lauguage,price,Bookprice} = await params.json()
        const con = await getConnection()
        const sql = 'UPDATE book SET bookName=?,bookAuthor=?,publishYear=?,lauguage=?,price=?,Bookprice=? WHERE bookId=?'
        const queryData = [bookName,bookAuthor,publishYear,lauguage,price,Bookprice,pid]
        const [result] = await con.execute(sql,queryData)
        if(result.affectedRows > 0){
            return new Response(JSON.stringify({ status:true, message:"Book updated successfully..!!" }), {
                headers: {
                    'Content-type': 'application/json'
                }
            })
        } else{
            return new Response(JSON.stringify({ status:false, message:"Book not found..!!" }), {
                headers: {
                    'Content-type': 'application/json'
                }
            })
        }

    } catch(err){
        console.error(err)
        return new Response(JSON.stringify({ status: false, message: "Internal server error !!" }), {
            headers: {
                'Content-type': 'application/json'
            }
        })


    }
    
}


export async function DELETE(params) {
    try{

        const {pid} = await params.json()
        const con = await getConnection()
        const sql = 'DELETE FROM book WHERE bookId=?'
        const queryData = [pid]
        const [result] = await con.execute(sql,queryData)
        con.releaseConnection()
        if(result.affectedRows > 0){
            return new Response(JSON.stringify({ status:true, message:"Book deleted successfully..!!" }), {
                headers: {
                    'Content-type': 'application/json'
                }
            })
        } else{
            return new Response(JSON.stringify({ status:false, message:"Book not found..!!" }), {
                headers: {
                    'Content-type': 'application/json'
                }
            })
        }

    } catch(err){
        console.error(err)
        return new Response(JSON.stringify({ status: false, message: "Internal server error !!" }), {
            headers: {
                'Content-type': 'application/json'
            }
        })


    }
    
}


    // const data = await params.json()
        // const con = await getConnection()
        // const sql = 'INSERT INTO book (bookName,bookAuthor,publishYear,lauguage,price,Bookprice,createdAt) VALUES (?,?,?,?,?,?,?)';
        // const queryData = [bookName, bookAuthor, publishYear, lauguage, price, Bookprice, new Date().toLocaleDateString()]
        // const result = await con.execute(sql, queryData)

        // con.releaseConnection()
           // const db = await getConnection()
        // const query = 'INSERT INTO book (bookName,bookAuthor,publishYear,lauguage,price,Bookprice,bookImage,createdAt) VALUES (?,?,?,?,?,?,?,?)'
        // const [result] = await db.execute(query,[bookName,bookAuthor,publishYear,lauguage,price,Bookprice,bookImage,new Date().toISOString(),filePath])




// export async function POST(req) {
//     try {
//         const formData = await req.formData()
//         const bookName = formData.get('bookName')
//         const bookAuthor = formData.get('bookAuthor')
//         const publishYear = formData.get('publishYear')
//         const lauguage = formData.get('lauguage')
//         const price = formData.get('price')
//         const Bookprice = formData.get('Bookprice')
//         const bookImage = formData.get('bookImage')
        

//         if(!bookImage || !bookImage.name){
//             return new Response(JSON.stringify({ status: false, message: "Image not found !!" }), {
//                 headers: {
//                     'Content-type': 'application/json'
//                 }
//             })
//         }

//         const uploadsDir = path.join(process.cwd(),'public','uploads')
//         const fileURL = path.join(uploadsDir,bookImage.name)

//         if(!fs.existsSync(uploadsDir)){
//             fs.mkdirSync(uploadsDir,{recursive:true})
//         }

//         const fileBuffer = await bookImage.arrayBuffer()
//         fs.writeFileSync(fileURL,Buffer.from(fileBuffer))

//         const filePath = `/uploads/${bookImage.name}`

//         console.log(bookName); console.log(bookAuthor); 
//         console.log(publishYear); console.log(lauguage)
//         console.log(price); console.log(Bookprice)
//         console.log(filePath)

//         const con = await getConnection();
//         const sql = 'INSERT INTO book (bookName,bookAuthor,publishYear,lauguage,price,Bookprice,bookImage,createdAt) VALUES (?,?,?,?,?,?,?,?)';
//         const queryData = [bookName,bookAuthor,publishYear,lauguage,price,Bookprice,bookImage,new Date().toISOString(),filePath]
//         con.execute(sql,queryData)
//         con.releaseConnection()

//         return new Response(JSON.stringify({ status: true, message: "Book Added Successfully..!!" }), {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
  
//     }
//     catch (err) {
//         console.error(err)
//         return new Response(JSON.stringify({ status: false, message: "Internal server error !!" }), {
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         })
//         con.release();

//     }
// }

