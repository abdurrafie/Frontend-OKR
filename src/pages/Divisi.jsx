import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

import { IoIosAddCircle } from "react-icons/io";




export const Divisi = () => {
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [dataDivisi, setdataDivisi] = useState(null); // Menambahkan state data
    const [datatim, setdatatim] = useState(null); // Menambahkan state data
    const [TotalAnggota, setTotalAnggota] = useState(null); // Menambahkan state data
    const [showTambahDivisi, setShowTambahDivisi] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
    });


    useEffect(() => {
        // Pastikan peran pengguna telah diambil dari local storage
        const role = localStorage.getItem('role');
        setUserRole(role);

        // Cek apakah token tersimpan di Local Storage
        const token = localStorage.getItem('token');
        if (token) {
            // todo console.log('Token ditemukan:', token);

            axios.get('http://localhost:3050/divisi').then((response) => {
                //  Mengisi opsi kategori dengan data dari server
                const test = response.data.divisiData
                // console.log(response.data.divisiData);

                const teamIds = response.data.divisiData.map((Projek) => Projek._id); // Memastikan ID unik

                // console.log(teamIds);
                const promises = teamIds.map(async (teamId) => {
                    return axios.get(`http://localhost:3050/profile/profile/divisi/${teamId}`)
                        .then((teamResponse) => teamResponse.data.profiles)
                        .catch((teamError) => {
                            // console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });

                const TOtalAnggota = teamIds.map(async (teamId) => {
                    return axios.get(`http://localhost:3050/profile/profile/divisi/${teamId}/count`)
                        .then((teamResponse) => teamResponse.data.count)
                        .catch((teamError) => {
                            // console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });

                // console.log('TOtalAnggota', TOtalAnggota);

                Promise.all(TOtalAnggota).then((teamData) => {
                    // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                    // console.log(teamData);

                    console.log('all2 ', test);
                    console.log('td ', teamData);

                    const result = test.map((obj, index) => ({
                        ...obj,
                        total: teamData[index]
                    }));

                    console.log(result);

                    setdataDivisi(result)


                    // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setTotalAnggota(teamData.filter((data) => data !== null));

                    // Contoh menggunakan map untuk mengakses setiap data dalam array
                    teamData.map((data, index) => {
                        // console.log(`Data TatalAnggota ke-${index}:`, data);
                        // Lakukan operasi lain pada data di sini
                    });
                });

                Promise.all(promises).then((teamData) => {
                    // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                    // console.log(teamData);
                    // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setdatatim(teamData.filter((data) => data !== null));

                    // Contoh menggunakan map untuk mengakses setiap data dalam array
                    teamData.map((data, index) => {
                        // console.log(`Data ke-${index}:`, data);
                        // Lakukan operasi lain pada data di sini
                    });
                });
            });

        } else {
            // console.log('Token tidak ditemukan');
        }

    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // console.error('Token tidak ditemukan');
                return;
            }

            const response = await fetch('http://localhost:3050/divisi', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseData = await response.json();
                // console.log('Respon dari server (berhasil):', responseData);

                // Pastikan bahwa responseData memiliki properti 'token'
                if (responseData.token) {
                    // console.log('Token:', responseData.token);

                } else {
                    // console.error('Token tidak ditemukan dalam respons');
                }

                Swal.fire({
                    title: 'Sukses',
                    text: 'Register berhasil!',
                    icon: 'success',
                    confirmButtonText: 'OKE'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect pengguna ke halaman tampil.jsx
                        window.location.href = '/Divisi'; // Gantilah dengan URL yang sesuai
                    }
                });

            } else {
                // console.error('Pendaftaran gagal');
            }
        } catch (error) {
            // console.error('Terjadi kesalahan:', error);
        }
    };

    function countAnggotaDivisi(datatim, divisiNama) {
        if (!Array.isArray(datatim)) {
            return 0;
        }

        const anggotaDivisi = datatim.filter((Tim) => Tim.divisi === divisiNama);
        return anggotaDivisi.length;
    }




    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

            <div className="w-[260px]"></div>

            <div className="w-[1260px]">

                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-5">
                    <div className="flex">
                        {userRole === 'Admin' && (
                            <div className="bg-unggu w-[180px] p-1 rounded-xl ml-auto h-10 flex">
                                <div className="w-fit h-fit flex m-auto cursor-pointer" onClick={() => setShowTambahDivisi(true)}>
                                    <div className="text-white w-fit h-fit my-auto">
                                        <IoIosAddCircle size={'30px'} />
                                    </div>
                                    <p className='text-white w-fit h-fit my-auto font-semibold ml-2'>Add Divisi</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full mt-10">
                        <div className='flex w-full h-[60px] bg-white shadow rounded-lg'>
                            <span className="ml-5 my-auto w-[400px]">
                                <p className="text-gray-400 font-semibold">Nama Divisi</p>
                            </span>

                            <span className="mx-auto my-auto w-[500px]">
                                <p className="text-gray-400 font-semibold">ANGGOTA</p>
                            </span>

                            <span className="mr-5 my-auto w-[150px]">
                                <p className="text-gray-400 font-semibold">Total anggota</p>
                            </span>
                        </div>
                    </div>
                    {dataDivisi ? (
                        dataDivisi.map((divisi) => {
                            const jumlahAnggotaDivisi = countAnggotaDivisi(datatim, divisi.nama);

                            return (
                                <div key={divisi._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                                    <span className="ml-5 my-auto w-[300px]">
                                        <p className=" font-semibold">{divisi.nama}</p>
                                    </span>

                                    <div className="w-[500px] h-fit flex m-auto">
                                        {Array.isArray(datatim) && datatim.length > 0 ? (
                                            datatim.map((datatimm, objekIndex) => (
                                                datatimm.map((Tim, ResulIndex) => {
                                                    // Periksa apakah dataKeyResult terkait dengan objek saat ini
                                                    if (Tim.divisi === divisi.nama) {
                                                        return (
                                                            <div key={`tim-${ResulIndex}`} className="w-fit h-fit -mr-6">
                                                                <img src={`http://localhost:9000/okr.profile/${Tim.foto}`} className='w-10 h-10 my-auto rounded-full' />
                                                            </div>
                                                        );
                                                    }
                                                    return null; // Jika tidak ada dataKeyResult yang sesuai
                                                })
                                            ))) : (
                                            <div>Loading...</div>
                                        )}
                                    </div>

                                    {divisi.total > 0 ? (
                                        <p className="w-fit h-fit my-auto mr-5">{divisi.total} anggota</p>
                                    ) : (
                                        <p className="w-fit h-fit my-auto mr-5">Belum ada anggota</p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div>Loading...</div>
                    )}


                    {showTambahDivisi && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Tambah Divisi</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setShowTambahDivisi(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <form onSubmit={handleSubmit}>
                                        <input type="text" name="nama" required
                                            value={formData.nama} placeholder='Username' onChange={handleInputChange}
                                            className="px-2 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                        />

                                        <div className='w-[200px] mt-5 ml-auto'>
                                            <input type="submit" value="Tambah Divisi"
                                                className='rounded-xl w-full h-10 bg-unggu font-Inter font-semibold text-white' />
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>

                    )}

                </div>

                <div className='h-[70px] mt-2'></div>

            </div>

        </div>
    )
}
