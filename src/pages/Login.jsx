import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

import axios from 'axios';

import fotoBG from "./../foto/BC.png";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";




export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);

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
      const response = await fetch('http://localhost:3050/auth/login', {
        method: 'POST',
        headers: {
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
          localStorage.setItem('token', responseData.token);

          // Decode the token
          const decodedToken = jwt_decode(responseData.token);

          // Anda dapat mengakses data dalam decodedToken sesuai dengan struktur token JWT Anda
          console.log('Dekode Token:', decodedToken);
          const userId = decodedToken.id;



          // Contoh mengakses ID pengguna dari token
          // Kirim token ke server
          const responseUserData = await axios.get(`http://localhost:3050/auth/${userId}`, {
            headers: {
              Authorization: `Bearer ${responseData.token}`,
            },
          });

          if (responseUserData.status === 200) {
            try {
              const userData = responseUserData.data;
              console.log('Data Pengguna:', userData);

              // Lakukan sesuatu dengan data pengguna, seperti menyimpannya dalam state
              // atau menavigasi ke halaman berikutnya dengan data ini.
            } catch (error) {
              console.error('Terjadi kesalahan dalam menangani respons JSON:', error);
            }
          } else {
            console.error('Gagal mengambil data pengguna');
          }
          // console.log('role kita :', responseUserData.data.user.role);
          localStorage.setItem('role', responseUserData.data.user.role);

          setSuccessMessage('berhasil Login!');





          //   if (responseUserData.data.user.role == "Admin") {
          //     window.location.href = '/halamanBarang'; // Redirect to the admin page
          //     console.log('admin cui');
          //     localStorage.setItem('Nama', responseUserData.data.user.name);
          //   } else {
          //     window.location.href = '/Home'; // Redirect to the public page
          //     console.log('public cui');
          //     localStorage.setItem('Role', responseUserData.data.user.role);
          //     localStorage.setItem('Nama', responseUserData.data.user.name);
          //   }




        } else {
          console.error('Token tidak ditemukan dalam respons');
        }
        // Swal.fire({
        //   title: 'Sukses',
        //   text: 'Register berhasil!',
        //   icon: 'success',
        //   confirmButtonText: 'OKE'
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     // Redirect pengguna ke halaman tampil.jsx
        //     window.location.href = '/Profile'; // Gantilah dengan URL yang sesuai
        //   }
        // });

        window.location.href = '/Dashboard'; // Gantilah dengan URL yang sesuai
        
      } else {
        console.error('Login gagal');
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Name atau Password salah!!',
        })
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };




  const pageStyle = {
    backgroundImage: `url(${fotoBG})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // Ensure the background covers the entire viewport height
  };
  return (
    <div style={pageStyle}>
      <div className='relative w-full flex h-[707px]'>
        <div className="w-[450px] h-[707px] bg-black opacity-80 ml-auto my-auto"></div>
        <div className="w-[450px] h-[707px] absolute z-10 flex right-0">
          <div className="w-full my-auto">
            <h1 className='font-semibold text-3xl text-white w-fit h-fit mx-auto mb-[50px] '>LOGIN</h1>

            <div className="w-[300px] mx-auto">
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder='Username' autoFocus
                  required value={formData.name} onChange={handleInputChange}
                  className='p-2 h-8 rounded-[15px] w-full mb-[30px]' />

                <div className='relative w-full h-fit mb-[30px]'>
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder='password' autoFocus
                    required value={formData.password} onChange={handleInputChange}
                    className='p-2 h-8 rounded-[15px] w-full ' />
                  <div onClick={toggleShowPassword} className=' right-1 hover:text-unggu absolute top-1'>
                    {showPassword ? <AiFillEyeInvisible size={'25px'} /> : <AiFillEye size={'25px'} />}
                  </div>
                </div>

                <input type="submit" value="Login" className='rounded-xl w-full h-10 z-50 bg-unggu font-Inter font-semibold text-white' />

              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
