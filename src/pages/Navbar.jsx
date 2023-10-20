import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

import Logo from "./../foto/Logo.png";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiSolidDashboard, BiTargetLock, BiLogOut } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";


export const Navbar = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));


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

  const [dataProfile, setDataProfile] = useState(null); // Menambahkan state data

  const location = useLocation(); // Mendapatkan informasi tentang URL yang sedang aktif

  const hideNavbarPaths = ['/', '/Register', '/register',]; // Paths untuk halaman yang tidak perlu menampilkan Navbar

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
          // console.log('Respon dari server (Berhasil mendapatkan profile):', data);
          setDataProfile(data);
        })
        .catch(error => {
          console.error('Terjadi kesalahan:', error);
        });
    } else {
      console.log('Token tidak ditemukan');
    }
  }, []); // Parameter kedua [] memastikan bahwa useEffect hanya dijalankan sekali saat komponen pertama kali di-render

  // Mengecek apakah dataProfile tidak null sebelum mencoba mengakses properti
  if (!dataProfile) {
    return <div>Loading...</div>;
  }


  // console.log(dataProfile.id_user);


  return (
    <div className="flex flex-wrap w-[260px] bg-white fixed font-Poppins">
      <div className='w-[260px] bg-white font-Inter h-[647px]'>
        <img className='w-[200px] mx-auto mt-10 '
          src={Logo} />

        <NavLink to='/Dashboard' className={'mt-10'}>
          <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-10 text-gray-400 ${location.pathname === '/Dashboard' ? 'nav-link-active' : ''}`}>
            <div className="flex my-auto w-fit font-semibold h-fit">
              <BiSolidDashboard size={'23px'} />
              <p className={`ml-3 ${location.pathname === '/Dashboard' ? 'nav-link-active' : ''}`}>Dashboard</p>
            </div>
          </div>
        </NavLink>

        <NavLink to='/OKR'>
          <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/OKR' ? 'nav-link-active' : ''}`}>
            <div className="flex my-auto w-fit font-semibold h-fit" >
              <BiTargetLock size={'23px'} />
              <p className={`ml-3 ${location.pathname === '/OKR' ? 'nav-link-active' : ''}`} >OKRs</p>
            </div>
          </div>
        </NavLink>
        {userRole === 'Admin' && (
          <NavLink to='/Approving'>
            <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/Approving' ? 'nav-link-active' : ''}`}>
              <div className="flex my-auto w-fit font-semibold h-fit" >
                <AiOutlineCheckCircle size={'23px'} />
                <p className={`ml-3 ${location.pathname === '/Approving' ? 'nav-link-active' : ''}`} >Approving</p>
              </div>
            </div>
          </NavLink>
        )}
        {userRole === 'Admin' && (

          <NavLink to='/Divisi'>
            <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/Divisi' ? 'nav-link-active' : ''}`}>
              <div className="flex my-auto w-fit font-semibold h-fit" >
                <HiOutlineUserGroup size={'23px'} />
                <p className={`ml-3 ${location.pathname === '/Divisi' ? 'nav-link-active' : ''}`} >Divisi</p>
              </div>
            </div>
          </NavLink>
        )}
        {userRole === 'Admin' && (

          <NavLink to='/User'>
            <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/User' ? 'nav-link-active' : ''}`}>
              <div className="flex my-auto w-fit font-semibold h-fit" >
                <FaRegCircleUser size={'23px'} />
                <p className={`ml-3 ${location.pathname === '/User' ? 'nav-link-active' : ''}`} >User</p>
              </div>
            </div>
          </NavLink>
        )}

      </div>

      <div className={`flex mt-auto mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 text-gray-400 cursor-pointer`} onClick={handleLogout}>
        <div className="flex my-auto w-fit font-semibold h-fit" >
          <BiLogOut size={'23px'} />
          <p className={`ml-3 `} >LOGOUT</p>
        </div>
      </div>

      <div className={`flex mt-auto mx-auto w-[200px] bg-white h-10`}>
      </div>

    </div>
  )
}
