import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

import { BsInstagram } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";


export const InputProfile = () => {
    const [successMessage, setSuccessMessage] = useState(null);
    const [instagramLink, setInstagramLink] = useState('#');
    const [twitterLink, setTwitterLink] = useState('#');
    const [tiktokLink, setTiktokLink] = useState('#');

    const [Divisi, setDivisi] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        notelpon: '',
        divisi: '',
        gender: '',
        tanggal_lahir: '',
        bio: '',
        quote: '',
        sosmed: [],
        foto: null,
    });

    // Tambahkan handleInputChange untuk tiga input sosial media
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name === 'instagram') {
            setInstagramLink(value);
        } else if (name === 'twitter') {
            setTwitterLink(value);
        } else if (name === 'tiktok') {
            setTiktokLink(value);
        } else if (type === 'file') {
            const selectedFile = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

            if (selectedFile) {
                const objectUrl = URL.createObjectURL(selectedFile);

                setFormData({
                    ...formData,
                    foto: selectedFile,
                });

                setImageFile(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormData({
                    ...formData,
                    foto: null, // Atur nilai null saat tidak ada file yang dipilih
                });
                setImageFile(null); // Menampilkan pratinjau file yang dipilih

            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };




    console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const sosmedArray = [];

            if (instagramLink) {
                sosmedArray.push(instagramLink);
            }
            if (twitterLink) {
                sosmedArray.push(twitterLink);
            }
            if (tiktokLink) {
                sosmedArray.push(tiktokLink);
            }

            const formDataToSend = {
                ...formData,
                sosmed: sosmedArray,
            };

            // ...

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }



            const response = await axios.post('http://localhost:3050/profile/add', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set header Content-Type
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Pendaftaran berhasil!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Profile';
                    }
                });

                setSuccessMessage('Pendaftaran berhasil!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };


    useEffect(() => {
        // Ambil daftar kategori dari database saat komponen dimuat
        axios.get('http://localhost:3050/divisi')
            .then((response) => {
                // Mengisi opsi kategori dengan data dari server
                setDivisi(response.data.divisiData);
            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });
    }, []);

    // console.log(Divisi);




    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>
            <div className="w-[375px]"></div>
            <div className="w-full">
                <div className='h-[70px]'></div>

                <div className="w-[1200px] bg-white mx-auto mt-5">
                    <h1 className="w-[94%] mx-auto font-semibold text-3xl py-[36px]">Input Profile</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="flex">
                            <div className="w-[530px] mx-auto">
                                <label htmlFor="" className='font-semibold h-fit'>Nama</label>
                                <input type="text" name="nama" placeholder='Nama Lengkap' autoFocus value={formData.nama} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                <label htmlFor="" className='font-semibold h-fit'>Email</label>
                                <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                <label htmlFor="" className='font-semibold h-fit'>Nomor Telpon</label>
                                <input type="text" name="notelpon" placeholder='Nomor Telpon' value={formData.notelpon} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />

                                <label htmlFor="" className='font-semibold h-fit'>Divisi</label>
                                <select name="divisi" value={formData.divisi.nama} onChange={handleInputChange}
                                    className="p-2 h-[41px] border-2 font-mono rounded-[5px] text-base mx-auto w-full mt-2 mb-[30px]"
                                >
                                    <option value="">Pilih divisi</option>
                                    {Divisi.map((divisi) => (
                                        <option key={divisi._id} value={divisi.nama}>
                                            {divisi.nama}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="" className='font-semibold h-fit'>Jenis Kelamin</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange}
                                    className="p-2 h-[41px] border-2 font-mono rounded-[5px] text-base mx-auto w-full mt-2 mb-[30px]"
                                >
                                    <option value="">Pilih Jenis Kelamin</option>
                                    <option value="Laki Laki">Laki Laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>

                                <label htmlFor="" className='font-semibold h-fit'>Tanggal Lahir</label>
                                <input type="date" name="tanggal_lahir" placeholder='Tanggal Lahir' value={formData.tanggal_lahir} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[30px]' />
                            </div>


                            <div className="w-[530px] mx-auto">
                                <label htmlFor="" className='font-semibold h-fit'>Bio</label>
                                <textarea name="bio" placeholder='Bio' value={formData.bio} onChange={handleInputChange}
                                    className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-2 mb-[23.6px]' />

                                <label htmlFor="" className='font-semibold h-fit mt-[32px]'>Sosial Media</label>
                                <div className='h-[41px] flex text-base rounded-[5px] w-full mt-[8px]'>
                                    <div className='p-2 w-[41px] flex h-[41px] rounded-[5px] bg-gray-200'>
                                        <span className='w-fit h-fit mx-auto my-auto'>
                                            <BsInstagram size={'20px'} />
                                        </span>
                                    </div>
                                    <input type="text" name="instagram" placeholder='Url Instagram' value={instagramLink} onChange={handleInputChange}
                                        className='p-2 h-[41px] border text-base rounded-[5px] w-[90%] ml-auto' />
                                </div>

                                <div className='h-[41px] flex text-base rounded-[5px] w-full mt-[12px]'>
                                    <div className='p-2 w-[41px] flex h-[41px] rounded-[5px] bg-gray-200'>
                                        <span className='w-fit h-fit mx-auto my-auto'>
                                            <RiTwitterXFill size={'20px'} />
                                        </span>
                                    </div>
                                    <input type="text" name="twitter" placeholder='Url Twitter' value={twitterLink} onChange={handleInputChange}
                                        className='p-2 h-[41px] border text-base rounded-[5px] w-[90%] ml-auto' />
                                </div>

                                <div className='h-[41px] flex text-base rounded-[5px] w-full mt-[12px]'>
                                    <div className='p-2 w-[41px] flex h-[41px] rounded-[5px] bg-gray-200'>
                                        <span className='w-fit h-fit mx-auto my-auto'>
                                            <FaTiktok size={'20px'} />
                                        </span>
                                    </div>
                                    <input type="text" name="tiktok" placeholder='Url Tiktok' value={tiktokLink} onChange={handleInputChange}
                                        className='p-2 h-[41px] border text-base rounded-[5px] w-[90%] ml-auto' />
                                </div>


                                <input type="file" name="foto" id="file-input" onChange={handleInputChange}
                                    className='p-2 h-8 rounded-[5px] w-full mt-2 mb-[30px]' style={{ display: 'none' }} />
                                <div className="mx-auto mt-2 w-fit">
                                    <button type="button"
                                        className="bg-unggu mx-auto text-white px-2 py-1 rounded-md mt-2"
                                        onClick={() => document.getElementById('file-input').click()}
                                    >
                                        Tambah Foto Profile
                                    </button>
                                </div>
                                {imageFile && (
                                    <div className="w-fit mx-auto mt-3">
                                        <img src={imageFile} alt="Preview" style={{ maxWidth: '100%' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='w-[94%] mx-auto'>
                            <input type="submit" value="Kirim"
                                className='w-full h-[41px] rounded-xl font-semibold text-xl text-white bg-unggu' />
                        </div>
                        <div className="mt-5 w-full h-3"></div>
                    </form>
                </div>
                <div className="mt-10 w-full"></div>
            </div>
        </div>
    )
}
