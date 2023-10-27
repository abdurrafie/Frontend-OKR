import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

import Logo from "./../foto/Logo.png";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiSolidDashboard, BiTargetLock, BiLogOut, BiCategory } from "react-icons/bi";
import { BsListTask, BsFillClipboardCheckFill } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineDown, AiOutlineUp, AiOutlineInbox, AiOutlinePicture, AiOutlineHome, AiOutlineCheckCircle } from "react-icons/ai";

//logo task BsFillClipboardCheckFill

export const Navbar = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isClicked, setIsClicked] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);

  const toggleSubNav = () => {
    setIsClicked(!isClicked);
    setShowSubNav(!showSubNav);
    setShowSubMenu(!showSubMenu);
  };


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
    <div className="xl:flex flex-wrap xl:w-[260px] hidden bg-white fixed font-Poppins">
      <div className='w-[260px] bg-white font-Inter h-[647px] sm:hidden lg:block'>
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

        <NavLink to='/Task'>
          <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/Task' ? 'nav-link-active' : ''}`}>
            <div className="flex my-auto w-fit font-semibold h-fit" >
              <BsFillClipboardCheckFill size={'23px'} />
              <p className={`ml-3 ${location.pathname === '/Task' ? 'nav-link-active' : ''}`} >Task</p>
            </div>
          </div>
        </NavLink>

        {/* {userRole === 'Admin' && (
          <NavLink to='/Approving'>
            <div className={`flex mx-auto w-[200px] hover:bg-unggu hover:text-white rounded-xl p-3 mt-5 text-gray-400 ${location.pathname === '/Approving' ? '' : ''}`}>
              <div className="flex my-auto w-fit font-semibold h-fit" >
                <AiOutlineCheckCircle size={'23px'} />
                <p className={`ml-3 ${location.pathname === '/Approving' ? '' : ''}`} >Approving</p>
              </div>
            </div>
          </NavLink>
        )} */}

        {userRole === 'Admin' && (
          <div className={`mx-auto w-[200px] mt-5 text-gray-400`}>
            {/* <div className={`w-full mx-auto flex hover:bg-unggu hover:text-white rounded-xl p-3 text-gray-400 ${isClicked ? 'text-white bg-gray-300' : ''} `} onClick={toggleSubNav} id="nav-menu-1"> */}
            <div className={`w-full mx-auto flex hover:bg-unggu hover:text-white rounded-xl cursor-pointer p-3 text-gray-400 ${location.pathname === '/Approving' ? 'nav-link-active' : location.pathname === '/ApprovingTask' ? 'nav-link-active' : ''} `} onClick={toggleSubNav} id="nav-menu-1">
              <span className={` font-semibold mr-2`}><AiOutlineCheckCircle size={'23px'} /></span>
              <p className={`w-fit font-semibold `}>Approving</p> <span className={`w-fit ml-auto h-fit my-auto font-semibold `}>{isClicked ? <AiOutlineUp /> : <AiOutlineDown />}</span>
            </div>

            <div className={`transition-all duration-1000 ease-in-out overflow-hidden ${showSubMenu ? 'block max-h-[200px] duration-1000 transition' : 'h-0'}`}>
              {showSubNav && (
                <div className="w-[150px] ml-auto">
                  <ul className={`list-none w-full hover:list-disc mt-1 p-3 cursor-pointer rounded-xl ${location.pathname === '/Approving' ? 'list-disc text-black' : ''}`}>
                    <li className={`font-semibold ${location.pathname === '/Approving' ? ' ' : ''}`}>
                      <NavLink
                        to='/Approving'
                        className={` flex font-semibold  ${location.pathname === '/Approving' ? '' : ''}`}
                      >
                        Key Result
                      </NavLink>
                    </li>
                  </ul>
                  <ul className={`list-none hover:list-disc mt-1 p-3 cursor-pointer rounded-xl   ${location.pathname === '/ApprovingTask' ? 'list-disc text-black' : ''}`}>
                    <li className={`font-semibold`}>
                      <NavLink
                        to='/ApprovingTask'
                        className={`font-semibold`}
                      >
                        Task
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
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
