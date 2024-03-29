import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';


import Logo from "./../foto/Logo.png";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidDashboard, BiTargetLock, BiSolidUserCircle } from "react-icons/bi";


export const NavbarAT = () => {
    const [Halaman, setHalaman] = useState(localStorage.getItem('Hal'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    const [dataProfile, setDataProfile] = useState(null); // Menambahkan state data
    const [IDProfile, setIDProfile] = useState(null); // Menambahkan state data
    const location = useLocation();
    const [showNotifikasi, setshowNotifikasi] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showProfile, setshowProfile] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showNotif, setshowNotif] = useState(true); // Tambahkan state untuk popup pengeditan
    const [LastProgres, setLastProgres] = useState(null); // Menambahkan state data
    const [DataPending, setDataPending] = useState(null); // Menambahkan state data




    const hideNavbarPaths = ['/', '/Register', '/register']; // Paths untuk halaman yang tidak perlu menampilkan Navbar

    // Fungsi untuk menutup notifikasi
    const closeNotifikasi = () => {
        setshowNotifikasi(false);
    }

    if (hideNavbarPaths.includes(location.pathname)) {
        return null; // Jika path saat ini ada dalam daftar hideNavbarPaths, tampilkan null (tidak ada Navbar)
    }

    // Gunakan useEffect untuk mengambil data saat komponen pertama kali di-render
    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        // Cek apakah token tersimpan di Local Storage
        const token = localStorage.getItem('token');
        if (token) {
            // console.log('Token ditemukan:', token);

            // Lakukan permintaan ke server menggunakan token
            fetch('http://localhost:3050/profile/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Permintaan gagal');
                    }
                })
                .then(data => {
                    // console.log('Respon dari server (Berhasil mendapatkan profile):', data._id);
                    setDataProfile(data);
                    setIDProfile(data._id);
                })
                .catch(error => {
                    console.error('Terjadi kesalahan:', error);
                });

            axios.get(`http://localhost:3050/progres/dataprogres/approved/${IDProfile}`)
                .then((response) => {
                    // Mengisi opsi kategori dengan data dari server
                    console.log('ID Profile', response.data);
                    setLastProgres(response.data)

                    // setAlldatatim(response.data.profileData);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

            axios.get(`http://localhost:3050/progres/status/pending`)
                .then((response) => {
                    // Mengisi opsi kategori dengan data dari server
                    console.log('DATA PENDING', response.data.pendingProgres);
                    setDataPending(response.data.pendingProgres)

                    // setAlldatatim(response.data.profileData);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

            const interval = setInterval(() => {
                if (showNotifikasi) {
                    closeNotifikasi();
                    // setshowNotifikasi(true);
                }
            }, 500);

            // Membersihkan interval saat komponen tidak lagi digunakan
            return () => {
                clearInterval(interval);
            };
        } else {
            console.log('Token tidak ditemukan');
        }
    }, [IDProfile]); // Parameter kedua [] memastikan bahwa useEffect hanya dijalankan sekali saat komponen pertama kali di-render


    // Mengecek apakah dataProfile tidak null sebelum mencoba mengakses properti
    if (!dataProfile) {
        return <div>Loading...</div>;
    }


    // console.log('IDProfile', IDProfile);
    // useEffect(() => {
    //     axios.get(`http://localhost:3050/progres/dataprogres/approved/${IDProfile}`)
    //         .then((response) => {
    //             // Mengisi opsi kategori dengan data dari server
    //             console.log('ID Profile', response.data);
    //             setLastProgres(response.data)

    //             // setAlldatatim(response.data.profileData);
    //         })
    //         .catch((error) => {
    //             console.error('Terjadi kesalahan:', error);
    //         });
    // }, [IDProfile]);

    // console.log(dataProfile.id_user);

    function getLocationLabel(path) {
        switch (path) {
            case '/Dashboard':
                return 'Dashboard';

            case '/OKR':
                return 'OKR';

            case '/Profile':
                return 'Profile';

            case '/InputProfile':
                return 'InputProfile';

            case '/Divisi':
                return 'Divisi';

            case '/Approving':
                return 'Approving';

            case '/User':
                return 'User';

            case '/ApprovingTask':
                return 'ApprovingTask';

            case '/Task':
                return 'Task';

            case '/Objective':
                return 'Objective';
            // Tambahkan lebih banyak case sesuai dengan halaman Anda
            default:
                return `${Halaman}`;
        }
    }

    // Memperbarui label setiap 2 detik
    setInterval(() => {
        const HAL = localStorage.getItem('Hal');
        setHalaman(HAL);
    }, 2000);

    const handleClick = () => {
        setshowNotifikasi(true);
    }
    // console.log('LastProgres', LastProgres);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Kamu yakin mau Logout",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
            }
        });
    };







    return (
        <div className="flex xl:w-[83%] w-full right-0 fixed z-10 font-Poppins">
            <div className='w-full bg-white font-Inter h-[70px] relative flex'>
                <h1 className="text-2xl font-bold my-auto ml-5">  {getLocationLabel(location.pathname)}</h1>

                {/* <div className="ml-[100px] mx-auto w-[500px] bg-gray-50 h-fit p-3 my-auto rounded-xl flex">
            <span className='ml-3 text-unggu'><IoSearch size={'23px'}/></span>
            <p className="ml-3">Search here...</p>
            </div> */}

                <div className="relative ml-auto my-auto flex">

                    <div className="text-Gold w-fit h-fit p-1 my-auto cursor-pointer rounded-md mr-3 bg-yellow-50 relative"
                        onClick={() => {
                            handleClick();
                            setshowNotif(false);
                        }}
                    >
                        <IoMdNotificationsOutline size={'23px'} />
                        <div className={`w-1 h-1 absolute right-[2px] top-[2px] bg-red-500 rounded-full ${showNotif ? '' : 'hidden'}`}></div>
                    </div>
                    <div className="" onMouseEnter={() => setshowProfile(true)} onMouseLeave={() => setshowProfile(false)}>
                        <div className="my-auto flex mr-5">
                            <img src={`http://localhost:9000/okr.profile/${dataProfile.foto}`} className='w-12 h-12 my-auto mr-2 rounded-full p-1 border-unggu border' />
                        </div>

                        {showProfile && (
                            <div className="absolute inset-0 items-center justify-center z-10 w-[300px] h-fit -left-[220px] top-[40px] ">
                                <div className="bg-white p-3 mt-7 shadow-lg shadow-black/20 w-full rounded-md">
                                    <div className="flex">
                                        <img src={`http://localhost:9000/okr.profile/${dataProfile.foto}`} className='w-10 h-10 my-auto mr-2 rounded-full border-2' />
                                        <p className="w-fit h-fit my-auto ml-2">{dataProfile.nama}</p>
                                    </div>

                                    <hr className="my-3" />

                                    <NavLink to={'/Profile'}>
                                        <div className="flex ml-2 p-1 hover:bg-unggu-muda rounded-md text-gray-400 cursor-pointer hover:text-black">
                                            <BiSolidUserCircle className='w-8 h-8 my-auto mr-2 rounded-full' />
                                            <p className="w-fit h-fit my-auto ml-2">Profile</p>
                                        </div>
                                    </NavLink>

                                    <div className="flex mt-4 ml-3 p-1 hover:bg-unggu-muda rounded-md text-gray-400 cursor-pointer hover:text-black" onClick={handleLogout}>
                                        <HiOutlineLogout className='w-7 h-7 my-auto mr-2 rounded-full' />
                                        <p className="w-fit h-fit my-auto ml-2">Logout</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {showNotifikasi && (
                        <div className="absolute inset-0 p-3 items-center justify-center z-10 w-[400px] lg:w-[450px] h-fit shadow-lg cursor-pointer shadow-black/20 bg-white -left-72 lg:-left-[350px] rounded-xl top-[50px] border "
                            onClick={closeNotifikasi} >
                            <div className="flex">
                                <div className="overflow-y-scroll overflow-hidden w-full h-[350px] mt-3">
                                    <div className="w-full h-fit">
                                        {userRole === 'Admin' ? (
                                            <div className="">
                                                {DataPending ? (
                                                    DataPending.map((Progres) => (
                                                        <div key={Progres._id} className="h-10 mb-5 flex">
                                                            <div className="">
                                                                <img src={`http://localhost:9000/okr.profile/${Progres.foto_profile}`} className='w-10 h-10 my-auto mr-2 rounded-full border' />
                                                                {/* <BsFillBellFill size={'20px'} className='mb-2 text-unggu' /> */}
                                                                {/* <div className="w-1 h-12 bg-gray-300 mx-auto rounded-xl"></div> */}
                                                            </div>
                                                            <div className="w-full h-fit my-auto ml-2">
                                                                <h1 className="text-xs"> <span className="font-semibold ">{Progres.nama_profile}</span> mengumpulkan data progress <span className="font-semibold ">{Progres.nama}</span></h1>
                                                                {/* <h1 className="font-semibold text-sm">{Progres.nama}</h1> */}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Loading...</div>
                                                )}
                                            </div>

                                        ) : (
                                            <div className="">
                                                {LastProgres ? (
                                                    LastProgres.map((Progres) => (
                                                        <div key={Progres._id} className="h-10 mb-5 flex">
                                                            <div className="">
                                                                <img src={`http://localhost:9000/okr.profile/${Progres.foto_profile}`} className='w-10 h-10 my-auto mr-2 rounded-full border' />
                                                                {/* <BsFillBellFill size={'20px'} className='mb-2 text-unggu' /> */}
                                                                {/* <div className="w-1 h-12 bg-gray-300 mx-auto rounded-xl"></div> */}
                                                            </div>
                                                            <div className="w-full h-fit my-auto ml-2">
                                                                <h1 className="text-xs">Selamat 
                                                                <span className="font-semibold "> {Progres.nama_profile} </span>

                                                                    progress anda 

                                                                    <span className="font-semibold "> {Progres.nama} </span> 
                                                                    
                                                                    telah di approve oleh admin</h1>
                                                                {/* <h1 className="font-semibold text-sm">{Progres.nama}</h1> */}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div>Loading...</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>



                        </div>
                    )}



                </div>
            </div>
        </div>
    )
}
