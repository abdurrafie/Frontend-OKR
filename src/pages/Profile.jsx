import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';


import Logo from "./../foto/BGG.png";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { BsInstagram, BsPencilSquare } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";



export const Profile = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [Divisi, setDivisi] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [fotoFile, setfotoFile] = useState(null);

    const [instagramLink, setInstagramLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [tiktokLink, setTiktokLink] = useState('');


    const [dataProfile, setDataProfile] = useState(null); // Menambahkan state data
    const [dataProfileAll, setDataProfileAll] = useState(null); // Menambahkan state data
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        notelpon: '',
        divisi: '',
        gender: '',
        tanggal_lahir: '',
        bio: '',
        sosmed: [],
        foto: null,
    });


    // Gunakan useEffect untuk mengambil data saat komponen pertama kali di-render
    useEffect(() => {
        // Cek apakah token tersimpan di Local Storage
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Token ditemukan:', token);

            // Ambil daftar kategori dari database saat komponen dimuat
            axios.get('http://localhost:3050/divisi')
                .then((response) => {
                    // Mengisi opsi kategori dengan data dari server
                    console.log(response.data);
                    setDivisi(response.data.divisiData);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

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
                    console.log('Respon dari server (Berhasil mendapatkan profile):', data);
                    setDataProfile(data);
                    setfotoFile(data.foto)
                    setImageFile(`http://localhost:9000/okr.profile/${data.foto}`)
                    const produkData = data
                    if (!formData.nama) {
                        setFormData({
                            nama: produkData.nama,
                            email: produkData.email,
                            notelpon: produkData.notelpon,
                            divisi: produkData.divisi,
                            gender: produkData.gender,
                            tanggal_lahir: produkData.tanggal_lahir,
                            bio: produkData.bio,
                            foto: fotoFile,
                        });
                        setInstagramLink(produkData.sosmed[0])
                        setTwitterLink(produkData.sosmed[1])
                        setTiktokLink(produkData.sosmed[2])
                    }
                })
                .catch(error => {
                    console.error('Terjadi kesalahan:', error);
                });

            fetch('http://localhost:3050/profile/all', {
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
                    console.log('Respon dari server (Berhasil mendapatkan all data):', data.profileData);
                    setDataProfileAll(data.profileData);
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
    if (!dataProfile.nama) {
        // Jika data profil kosong atau tidak memiliki nama, arahkan ke halaman input profil
        window.location.href = '/InputProfile';
    }

    const sosmeed = dataProfile.sosmed;

    const TanggalBenar = dataProfile.tanggal_lahir;


    // Langkah 1: Buat fungsi untuk mengonversi tanggal
    function convertDateFormat(inputDate) {
        // Membagi tanggal menjadi komponen hari, bulan, dan tahun
        const dateComponents = inputDate.split('-');
        if (dateComponents.length !== 3) {
            // Pastikan tanggal memiliki format yang benar (DD-MM-YYYY)
            return null;
        }

        // Dapatkan komponen tahun, bulan, dan hari
        const year = dateComponents[0];
        const month = dateComponents[1];
        const day = dateComponents[2];

        // Buat tanggal baru dalam format "YYYY-MM-DD"
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }

    const tanggalYangBenar = convertDateFormat(TanggalBenar);


    // Hasil tanggal yang telah dikonversi



    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (name === 'instagram') {
            setInstagramLink(value || '#');
        } else if (name === 'twitter') {
            setTwitterLink(value || '#');
        } else if (name === 'tiktok') {
            setTiktokLink(value || '#');
        } else if (type === 'file') {
            const selectedFile = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama
            const filekirim = e.target.files[0].name;
            const fotoedit = dataProfile.foto

            if (selectedFile) {
                const objectUrl = URL.createObjectURL(selectedFile);

                setFormData({
                    ...formData,
                    foto: selectedFile,
                });
                setfotoFile(selectedFile);

                setImageFile(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormData({
                    ...formData,
                    foto: fotoedit, // Atur nilai null saat tidak ada file yang dipilih
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    console.log('Data yang akan dikirim ke server:', fotoFile);


    const Edit = async () => {
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
                foto: fotoFile,
            };

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            console.log('Data yang akan dikirim ke server:', formDataToSend);
            const response = await axios.put(`http://localhost:3050/profile/edit`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set header Content-Type
                },
                body: JSON.stringify(formDataToSend),
            });

            console.log('CEK CEK', response);
            if (response.status === 200 || response.status === 201) { // Periksa kode status HTTP 200 (OK) atau 201 (Created)
                try {
                    const responseData = response.data;
                    console.log('Respon dari server (berhasil):', responseData);
                    Swal.fire({
                        title: 'Sukses',
                        text: 'Pendaftaran berhasil!',
                        icon: 'success',
                        confirmButtonText: 'OKE',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // window.location.href = '/halamanBarang';
                        }
                    });

                    setSuccessMessage('Pendaftaran berhasil!');
                } catch (error) {
                    console.error('Gagal mengambil data JSON dari respons:', error);
                    Swal.fire('Error', 'Terjadi kesalahan dalam memproses respons', 'error');
                }

            } console.log('Data produk berhasil diperbarui', response.data);
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
                    <img src={Logo} className='' />
                    <div className='flex relative p-4 rounded-xl -mt-14 bg-white/80 w-[95%] mx-auto'>
                        <img src={`http://localhost:9000/okr.profile/${dataProfile.foto}`}
                            className='w-20 h-20 border-unggu/60 p-[5px] border-4 rounded-full my-auto' />

                        <div className="my-auto ml-3">
                            <h1 className='font-semibold text-xl'>{dataProfile.nama}</h1>
                            <h1 className='font-semibold text-base text-gray-500'>{dataProfile.divisi}</h1>
                        </div>

                        <div className="ml-auto flex my-auto p-1 rounded-xl w-[120px] h-[50px] bg-white cursor-pointer hover:text-unggu hover:bg-Gold" onClick={() => setShowEditModal(true)}>
                            <div className="w-fit my-auto mx-auto h-fit flex">
                                <BsPencilSquare size={'23px'} />
                                <p className=" font-semibold ml-2">Edit</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[1200px] mx-auto flex mt-[20px]">
                    <div className="w-[700px] bg-white p-4 rounded-xl">
                        <h1 className="font-semibold text-xl">Profile Information</h1>
                        <h1 className='text-justify text-gray-500 mt-4'>{dataProfile.bio}</h1>

                        <div className="h-[1px] w-[95%] bg-gradient-to-r from-white/60 via-gray-300 to-white/60 mx-auto my-8"></div>

                        <div className="w-full h-fit flex">
                            <div className="">
                                <h1 className='font-semibold text-gray-400 mb-5'>Full Name: <span className="font-normal">{dataProfile.nama}</span></h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>Nomor telfon: <span className="font-normal">{dataProfile.notelpon}</span></h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>Email: <span className="font-normal">{dataProfile.email}</span></h1>
                                <h1 className='font-semibold text-gray-400 mb-5 flex'>Social Media:
                                    <span className="font-normal ml-1 text-white h-fit p-1 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"><a href={`https://${instagramLink}`} target="_blank"><BsInstagram size={'20px'} /></a></span>
                                    <span className="font-normal ml-1 bg-black text-white h-fit p-1 rounded-md"><a href={`https://${twitterLink}`} target="_blank"><RiTwitterXFill size={'20px'} /></a></span>
                                    <span className="font-normal ml-1 bg-black text-white h-fit p-1 rounded-md"><a href={`https://${tiktokLink}`} target="_blank"><FaTiktok size={'20px'} /></a></span>
                                </h1>
                            </div>

                            <div className="ml-20">
                                <h1 className='font-semibold text-gray-400 mb-5'>Gender: <span className="font-normal">{dataProfile.gender}</span></h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>Tanggal Lahir: <span className="font-normal">{tanggalYangBenar}</span></h1>
                                <h1 className='font-semibold text-gray-400 mb-5'>Grade: <span className="font-normal">{dataProfile.grade}</span></h1>

                            </div>
                        </div>
                    </div>

                    <div className="w-[480px] overflow-y-scroll bg-white p-4 rounded-xl ml-auto">
                        <h1 className="font-semibold text-xl mb-5">Teman</h1>
                        {dataProfileAll ? (
                            dataProfileAll.map((alldata) => (
                                <div className="w-full h-[65px] mb-5 flex" key={alldata._id}>
                                    <img src={`http://localhost:9000/okr.profile/${alldata.foto}`} className='w-[55px] h-[55px] border-unggu/60 p-[2px] border-2 rounded-full my-auto' />
                                    <div className="my-auto ml-3">
                                        <h1 className="font-semibold">{alldata.nama}</h1>
                                        <h1 className="font-light">Divisi : <span className='font-semibold text-gray-500'>{alldata.divisi}</span></h1>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>


                    {showEditModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-5xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Edit Profile</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setShowEditModal(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="flex">
                                        <div className="w-[470px]">
                                            <input type="text" name="nama" required
                                                value={formData.nama || dataProfile.nama} onChange={handleInputChange}
                                                className="px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                            />
                                            <br />

                                            <input type="email" name="email" required
                                                value={formData.email || dataProfile.email} onChange={handleInputChange}
                                                className="px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                            />
                                            <br />

                                            <input type="text" name="notelpon" required
                                                value={formData.notelpon || dataProfile.notelpon} onChange={handleInputChange}
                                                className="px-2 mt-1 h-[41px] border-2 font-mono text-black text-base mx-auto w-full mb-1"
                                            />
                                            <br />

                                            <div className="flex mt-1 mb-1">
                                                <select name="divisi" value={formData.divisi || dataProfile.divisi} onChange={handleInputChange}
                                                    className="px-2 h-[41px] border-2 font-mono text-black text-base w-[300px] "
                                                >
                                                    <option value={formData.divisi || dataProfile.divisi}>{formData.divisi || dataProfile.divisi}</option>
                                                    {Divisi.map((divisi) => (
                                                        <option key={divisi._id} value={divisi.nama}>
                                                            {divisi.nama}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select name="gender" value={formData.gender || dataProfile.gender} onChange={handleInputChange}
                                                    className="p-2 h-[41px] border-2 font-mono text-base ml-auto w-[300px]"
                                                >
                                                    <option value="Laki Laki">Laki Laki</option>
                                                    <option value="Perempuan">Perempuan</option>
                                                </select>
                                            </div>

                                            <input type="date" name="tanggal_lahir" placeholder='Tanggal Lahir' value={formData.tanggal_lahir || dataProfile.tanggal_lahir} onChange={handleInputChange}
                                                className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-1 mb-1' />

                                            <div className='h-[41px] flex text-base rounded-[5px] w-full mt-[8px]'>
                                                <div className='p-2 w-[41px] flex h-[41px] rounded-[5px] bg-gray-200'>
                                                    <span className='w-fit h-fit mx-auto my-auto'>
                                                        <BsInstagram size={'20px'} />
                                                    </span>
                                                </div>
                                                <input type="text" name="instagram" placeholder='Url Instagram' value={instagramLink} onChange={handleInputChange}
                                                    className='p-2 h-[41px] border text-base rounded-[5px] w-[90%] ml-auto' required />
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

                                            <div className='h-[41px] flex text-base rounded-[5px] w-full mt-[12px] mb-1'>
                                                <div className='p-2 w-[41px] flex h-[41px] rounded-[5px] bg-gray-200'>
                                                    <span className='w-fit h-fit mx-auto my-auto'>
                                                        <FaTiktok size={'20px'} />
                                                    </span>
                                                </div>
                                                <input type="text" name="tiktok" placeholder='Url Tiktok' value={tiktokLink} onChange={handleInputChange}
                                                    className='p-2 h-[41px] border text-base rounded-[5px] w-[90%] ml-auto' />
                                            </div>
                                        </div>

                                        <div className="w-[470px] ml-auto">
                                            <textarea name="bio" placeholder='Bio' value={formData.bio || dataProfile.bio} onChange={handleInputChange}
                                                className='p-2 h-[41px] border text-base rounded-[5px] w-full mt-1 mb-1' />

                                            <input type="file" name="foto" id="file-input" onChange={handleInputChange}
                                                className='p-2 h-8 rounded-[5px] w-full mt-1 mb-[30px]' style={{ display: 'none' }} />
                                            <div className="w-full mt-1 mb-1">
                                                <button type="button"
                                                    className="bg-unggu w-full mx-auto text-white px-2 py-1 rounded-md mt-1"
                                                    onClick={() => document.getElementById('file-input').click()}
                                                >
                                                    Edit Foto
                                                </button>
                                            </div>
                                            <div className="w-[150px] mx-auto mt-5">
                                                <img src={imageFile} alt="Foto Profil" style={{ maxWidth: '100%' }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full mx-auto mt-5'>
                                        <input type="submit" value="Kirim" onClick={Edit}
                                            className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
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
