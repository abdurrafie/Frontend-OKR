import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

import fotoBG from "./../foto/BC.png";

export const Register = () => {
  const [formData, setFormData] = useState({
      name: '',
      password: '',
      confirmPassword: '',
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
              window.location.href = '/'; // Gantilah dengan URL yang sesuai
            }
          });
          
        } else {
          console.error('Pendaftaran gagal');
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
        <div className='relative w-full flex h-[739px]'>
            <div className="w-[450px] h-[739px] bg-black opacity-80 ml-auto my-auto"></div>
            <div className="w-[450px] h-[739px] absolute flex right-0">
                <div className="w-full my-auto">
                    <h1 className='font-semibold text-3xl text-white w-fit h-fit mx-auto mb-[50px] '>REGISTER</h1>

                    <div className="w-[300px] mx-auto">
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder='Username' autoFocus onChange={handleInputChange}
                                className='p-2 h-8 rounded-[15px] w-full mb-[30px]' />
                            
                            <div className='relative w-full h-fit mb-[30px]'>
                                <input type="password" name="password" placeholder='Password' autoFocus onChange={handleInputChange}
                                    className='p-2 h-8 rounded-[15px] w-full ' />
                            </div>
                            <div className='relative w-full h-fit mb-[30px]'>
                                <input type="password" name="confirmPassword" placeholder='confirm Password' autoFocus onChange={handleInputChange}
                                    className='p-2 h-8 rounded-[15px] w-full ' />
                            </div>

                            <div className='w-1/2 ml-auto'>
                                <input type="submit" value="Regis"  
                                className='rounded-xl w-full h-10 bg-unggu font-Inter font-semibold text-white'/>
                            </div>
                        </form>

                        <p className='text-white mt-5 w-fit mx-auto'>Do you have account? <NavLink to={"/"} className='text-Gold hover:underline decoration-solid'>Login</NavLink></p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
