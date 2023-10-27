import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

import { IoIosAddCircle } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";



export const User = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [dataUser, setdataUser] = useState(null); // Menambahkan state data

    const [showTambahUser, setShowTambahUser] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // Menambahkan state untuk peran yang dipilih

    const [showEditUser, setShowEditUser] = useState(false); // Tambahkan state untuk popup pengeditan
    const [editFormData, setEditFormData] = useState({
        name: '',
        password: '',
        confirmPassword: '',
        role: '',
    }); // Tambahkan state untuk data pengguna yang akan diedit
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: '',
    });



    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleconfirmPassword = () => {
        setShowconfirmPassword(!showconfirmPassword);
    };



    useEffect(() => {
        // Pastikan peran pengguna telah diambil dari local storage
        const role = localStorage.getItem('role');
        setUserRole(role);

        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3050/auth/all').then((response) => {
                //  Mengisi opsi kategori dengan data dari server

                // console.log(response.data.userData);
                setdataUser(response.data.userData)
            });


        } else {
            console.log('Token tidak ditemukan');
        }


        axios.get(`http://localhost:3050/auth/${formData.id}`)
            .then((response) => {
                const produkData = response.data;
                console.log(produkData);
                // setProduk(produkData);
                if (!editFormData.name) {
                    setEditFormData({
                        name: produkData.name,
                        role: produkData.role,
                    });
                }
            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [selectedRole]);

    const handleEditClick = (id) => {
        const galleryToEdit = dataUser.find((gallery) => gallery._id === id);
        if (galleryToEdit) {
            setEditFormData({
                _id: galleryToEdit._id,
                name: galleryToEdit.name,
                role: galleryToEdit.role, // Bersihkan file saat mengedit untuk menghindari penggantian file yang tidak disengaja
            });
            console.log('berhasil', editFormData);
            setShowEditUser(true)
        } else {
            // Objek dengan id yang dicari tidak ditemukan, lakukan penanganan kesalahan di sini
            console.error(`Objek dengan id ${id} tidak ditemukan.`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        // Perbarui editFormData
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Password dan Confirm Password tidak sama!!.',
                });
                return; // Stop the submission
            }

            const response = await fetch('http://localhost:3050/auth/signup', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Respon dari server (berhasil):', responseData);

                // Pastikan bahwa responseData memiliki properti 'token'
                if (responseData.token) {
                    console.log('Token:', responseData.token);

                } else {
                    console.error('Token tidak ditemukan dalam respons');
                }

                Swal.fire({
                    title: 'Sukses',
                    text: 'Register berhasil!',
                    icon: 'success',
                    confirmButtonText: 'OKE'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect pengguna ke halaman tampil.jsx
                        window.location.href = '/User'; // Gantilah dengan URL yang sesuai
                    }
                });

            } else {
                console.error('Pendaftaran gagal');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }


            const response = await axios.put(`http://localhost:3050/auth/${editFormData._id}`, JSON.stringify(editFormData), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                // Handle success
                console.log('User updated:', response.data.user);


                if (response.status === 200 || response.status === 201) {
                    const responseData = response.data.user;
                    console.log('Respon dari server (berhasil):', responseData);

                    Swal.fire({
                        title: 'Sukses',
                        text: 'Berhasil Mengedit User!',
                        icon: 'success',
                        confirmButtonText: 'OKE',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '/User';
                        }
                    });

                    setSuccessMessage('Berhasil Mengedit User!');
                } else {
                    console.error('Pendaftaran gagal');

                    Swal.fire('Error', 'Pendaftaran gagal', 'error');
                }

            })
                .catch((error) => {
                    // Handle error
                    console.error('Error updating :', error);
                });



        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    console.log(editFormData);

    const handleDelete = (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://localhost:3050/auth/${itemId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    }).then(() => {
                        // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                        window.location.href = `/User`;

                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        );
                    }).catch((error) => {
                        console.error('Terjadi kesalahan saat menghapus data:', error);
                    });
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };


    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

            <div className="w-[260px]"></div>

            <div className="w-[1260px]">
                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-5">
                    <div className="flex">
                        <select name="roleFilter" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                            className='w-[200px] h-10 p-1 shadow-lg rounded-lg'>
                            <option value="">Semua Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Pekerja">Pekerja</option>
                            <option value="Menejemen">Menejemen</option>
                        </select>
                        {userRole === 'Admin' && (
                            <div className="bg-unggu w-[200px] cursor-pointer p-1 rounded-xl ml-auto h-10 flex" onClick={() => setShowTambahUser(true)}>
                                <div className="w-fit h-fit flex m-auto">
                                    <div className="text-white w-fit h-fit my-auto">
                                        <IoIosAddCircle size={'30px'} />
                                    </div>
                                    <p className='text-white w-fit h-fit my-auto font-semibold ml-2'>Tambah User</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full mt-10">
                        <div className='flex w-full h-[60px] bg-white shadow rounded-lg'>
                            <span className="ml-5 my-auto w-[400px]">
                                <p className="text-gray-400 font-semibold">Username</p>
                            </span>

                            <span className="mx-auto my-auto w-[500px]">
                                <p className="text-gray-400 font-semibold">Role</p>
                            </span>

                            <span className="mr-5 my-auto w-[150px]">
                                <p className="text-gray-400 font-semibold">Action</p>
                            </span>
                        </div>
                    </div>

                    {dataUser ? (
                        dataUser.filter((user) => !selectedRole || user.role === selectedRole).map((User) => (
                            <div key={User._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                                <span className="ml-5 my-auto w-[400px]">
                                    <p className=" font-semibold">{User.name}</p>
                                </span>

                                <span className="mx-auto my-auto w-[500px]">
                                    <div className={`h-8 w-28 flex my-auto rounded-xl ${User.role == "Progress" ? "bg-Gold" : User.role === "Menejemen" ? "bg-blue-600" : User.role === "Admin" ? "bg-Hijau-tua" : "bg-Gold"}`}>
                                        <p className='m-auto w-fit text-white font-semibold h-fit'>{User.role}</p>
                                    </div>
                                </span>

                                <span className="mr-5 my-auto flex w-[150px]">
                                    <div className="bg-gray-100 flex h-10 w-10 rounded-full ">
                                        <button className='w-fit h-fit m-auto text-black' onClick={() => handleEditClick(User._id)}>
                                            <BiSolidEdit size={'20px'} />
                                        </button>
                                    </div>

                                    <div className="bg-gray-100 flex h-10 w-10 rounded-full ml-5 ">
                                        <button className='w-fit h-fit m-auto text-red-600' onClick={() => handleDelete(User._id)}>
                                            <RiDeleteBinFill size={'20px'} />
                                        </button>
                                    </div>
                                </span>

                            </div>
                        ))
                    ) : (
                        <div>Loading...</div>
                    )}

                    {showTambahUser && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Tambah User</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setShowTambahUser(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <form onSubmit={handleSubmit}>

                                        <input type="text" name="name" required
                                            value={formData.name} placeholder='Username' onChange={handleInputChange}
                                            className="px-2 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                        />
                                        <div className="w-full flex h-fit mt-3 border-2">
                                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder='Password' required
                                                value={formData.password} onChange={handleInputChange}
                                                className="px-2 h-[41px]  font-mono text-black text-base mx-auto w-full"
                                            />
                                            <div className="w-[41px] h-[41px] flex">
                                                <span onClick={toggleShowPassword} className="w-fit cursor-pointer h-fit text-unggu m-auto">
                                                    {showPassword ? <AiFillEyeInvisible size={'25px'} /> : <AiFillEye size={'25px'} />}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full flex h-fit mt-3 border-2">
                                            <input type={showconfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder='confirm Password' required
                                                value={formData.confirmPassword} onChange={handleInputChange}
                                                className="px-2 h-[41px] font-mono text-black text-base mx-auto w-full "
                                            />
                                            <div className="w-[41px] h-[41px] flex">
                                                <span onClick={toggleconfirmPassword} className="w-fit cursor-pointer h-fit text-unggu m-auto">
                                                    {showconfirmPassword ? <AiFillEyeInvisible size={'25px'} /> : <AiFillEye size={'25px'} />}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='w-[200px] mt-5 ml-auto'>
                                            <input type="submit" value="Tambah User"
                                                className='rounded-xl w-full h-10 bg-unggu font-Inter font-semibold text-white cursor-pointer' />
                                        </div>

                                    </form>

                                </div>

                            </div>
                        </div>

                    )}

                    {showEditUser && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Edit User</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setShowEditUser(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-content py-4 text-left px-6">
                                    <form onSubmit={handleEditSubmit}>
                                        <input type="text" name="name" required value={editFormData.name}
                                            placeholder='Username' onChange={handleEditInputChange}
                                            className="px-2 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                        />
                                        <div className="w-full flex h-fit mt-3 border-2">
                                            <input type={showPassword ? 'text' : 'password'} name="password" placeholder='Password'
                                                value={editFormData.password} onChange={handleEditInputChange}
                                                className="px-2 h-[41px]  font-mono text-black text-base mx-auto w-full"
                                            />
                                            <div className="w-[41px] h-[41px] flex">
                                                <span onClick={toggleShowPassword} className="w-fit cursor-pointer h-fit text-unggu m-auto">
                                                    {showPassword ? <AiFillEyeInvisible size={'25px'} /> : <AiFillEye size={'25px'} />}
                                                </span>
                                            </div>
                                        </div>

                                        <select name="role" value={editFormData.role} onChange={handleEditInputChange}
                                            className="p-2 h-[41px] border-2 font-mono text-base mt-3 w-full"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Pekerja">Pekerja</option>
                                            <option value="Menejemen">Menejemen</option>
                                        </select>

                                        <div className='w-[200px] mt-5 ml-auto cursor-pointer'>
                                            <input type="submit" value="Edit Akun"
                                                className='rounded-xl w-full h-10 bg-unggu font-Inter font-semibold text-white cursor-pointer' />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>





                <div className='h-[10px] mt-10'></div>
            </div>
        </div>
    )
}
