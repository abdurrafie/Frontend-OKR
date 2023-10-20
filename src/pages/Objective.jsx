import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';


import { BiArrowBack, BiPencil } from "react-icons/bi";
import { AiOutlineEye, AiFillFolderAdd, AiOutlineLink } from "react-icons/ai";
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import { BsFillPersonCheckFill, BsCheckLg, BsLink45Deg, BsThreeDotsVertical } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { HiMiniChartBarSquare, HiDocumentText, HiOutlineDocumentText } from "react-icons/hi2";

import { HiOutlineViewGridAdd } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";

export const Objective = () => {
    const { id } = useParams();
    const [successMessage, setSuccessMessage] = useState('');


    const [dataProjek, setdataProjek] = useState({}); // Menambahkan state data
    const [dataObjective, setdataObjective] = useState({}); // Menambahkan state data
    const [dataKeyResult, setdataKeyResult] = useState({}); // Menambahkan state data
    const [datatim, setdatatim] = useState(null); // Menambahkan state data
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [showEditModal, setShowEditModal] = useState(false);
    const [totalTargetValue, setTotalTargetValue] = useState(0);
    const [totalCurrentValue, setTotalCurrentValue] = useState(0);
    const [persentage, setPersentage] = useState(0);
    const [TotalKey, setTotalKey] = useState(0);
    const [completedKeyResults, setCompletedKeyResults] = useState(0);
    const [completedObjek, setCompletedObjek] = useState(0);
    const [image, setImage] = useState(null);



    const [showTambah, setshowTambah] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showTambahKey, setshowTambahKey] = useState(false); // Tambahkan state untuk popup pengeditan
    const [IDObjek, setIDObjek] = useState(null); // Menambahkan state data
    const [dataObjectiveByID, setdataObjectiveByID] = useState({}); // Menambahkan state data



    const [showEditDanApus, setshowEditDanApus] = useState({}); // Tambahkan state untuk popup pengeditan


    const [formData, setFormData] = useState({
        id_projek: `${id}`,
        nama: '',
    });


    // Fungsi untuk menghitung jumlah key results yang selesai
    const countCompletedKeyResults = (dataKeyResult) => {
        let completedKeyResultsCount = 0;

        if (Array.isArray(dataKeyResult) && dataKeyResult.length > 0) {
            dataKeyResult.forEach((keyResultSet) => {
                keyResultSet.forEach((Resul) => {
                    // ... kode lainnya

                    if (Resul.status === "Selesai") {
                        completedKeyResultsCount++;
                    }

                    // ... kode lainnya
                });
            });
        }

        return completedKeyResultsCount;
    };

    useEffect(() => {
        const role = localStorage.getItem('role');
        setUserRole(role);

        axios.get(`http://localhost:3050/projek/${id}`)
            .then((response) => {
                // todo console.log(response.data.projek);
                const ObjectiveData = response.data.projek;
                setdataProjek(ObjectiveData);
                localStorage.setItem('Hal', `OKR / ${dataProjek.nama}`);

                const teamIds = response.data.projek.team;

                // console.log('id', teamIds);
                // Lakukan permintaan HTTP untuk setiap ID tim dan simpan hasilnya
                const promises = teamIds.map(async (teamId) => {
                    return axios.get(`http://localhost:3050/profile/profile/${teamId}`)
                        .then((teamResponse) => teamResponse.data.profile)
                        .catch((teamError) => {
                            console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });

                Promise.all(promises).then((teamData) => {
                    // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                    // console.log('data tim', teamData);
                    // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setdatatim(teamData.filter((data) => data !== null));
                });

            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

        axios.get(`http://localhost:3050/objektif/projek/${id}`)
            .then((response) => {
                // console.log('dataaa', response.data.objektif);
                const ObjectiveData = response.data.objektif;
                setdataObjective(ObjectiveData)
                const KEYIds = response.data.objektif
                    .map((objektif) => objektif._id).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik


                const statuspro = response.data.objektif
                    .map((objektif) => objektif.status).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik


                // console.log('STATUS:', statuspro);

                const completedStatusCount = statuspro.filter((status) => status === 'Selesai').length;

                // console.log('Jumlah yang Selesai:', completedStatusCount);
                setCompletedObjek(completedStatusCount);

                // console.log('KEYIds', KEYIds);
                // Lakukan permintaan HTTP untuk setiap ID tim dan simpan hasilnya
                const promises = KEYIds.map(async (teamId) => {
                    return axios.get(`http://localhost:3050/keyresult/objek/${teamId}`)
                        .then((teamResponse) => teamResponse.data.keyresults)
                        .catch((teamError) => {
                            console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });

                const statuskey = KEYIds.map(async (teamId) => {
                    return axios.get(`http://localhost:3050/keyresult/objek/${teamId}`)
                        .then((teamResponse) => {
                            const keyResults = teamResponse.data.keyresults; // Mengambil semua data keyresults
                            const statusess = keyResults.map(result => result.status); // Mengekstrak status saja

                            console.log('keyResults keyResults', keyResults);
                            // const statuspro = teamResponse.data.keyresults
                            //     .map((objektif) => objektif.status).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik
                            const completedStatusCount = statusess.filter((status) => status === 'Selesai').length;
                            // console.log('alal', keyResults);
                            setTotalKey(keyResults.length);
                            console.log('TotalKey', TotalKey);
                            setCompletedKeyResults(completedStatusCount);

                            return statusess;
                        })
                        .catch((teamError) => {
                            console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });




                // console.log('promises', promises);
                Promise.all(promises).then((teamData) => {
                    // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                    // console.log('team', teamData);

                    // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setdataKeyResult(teamData.filter((data) => data !== null));

                    // Contoh menggunakan map untuk mengakses setiap data dalam array
                    teamData.map((data, index) => {
                        // console.log(`Data ke-${index}:`, data);
                        // Lakukan operasi lain pada data di sini
                    });

                });

                // console.log('sa', statuskey);

                // Promise.all(statuskey).then((teamData) => {
                //     // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                //     console.log('teama', teamData);

                //     // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)

                //     const statusess = teamData.map(result => result); // Mengekstrak status saja


                //     const completedStatusKey = teamData.filter((data) => data.status === 'Selesai').length;

                //     console.log('status keuy',completedStatusKey);

                //     setCompletedKeyResults(teamData);

                //     // Contoh menggunakan map untuk mengakses setiap data dalam array
                //     teamData.map((data, index) => {
                //         console.log(`Data ke-${index}:`, data);
                //         // Lakukan operasi lain pada data di sini
                //     });



                // });

            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

        axios.get(`http://localhost:3050/keyresult/projek/${id}/values`)
            .then((response) => {
                console.log(response.data);
                const Data = response.data;
                setPersentage(Data);


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });



        // // Memanggil fungsi untuk menghitung key results yang selesai
        // const completedKeyResultsCount = countCompletedKeyResults(dataKeyResult);

        // // Mengupdate state completedKeyResults dengan jumlah key results yang selesai
        // setCompletedKeyResults(completedKeyResultsCount);


    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:3050/objektif/${IDObjek}`)
            .then((response) => {
                console.log('dataaaaaaaaaaaa', response.data.objek);
                const Data = response.data.objek;
                setdataObjectiveByID(Data);


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [IDObjek]);



    console.log(IDObjek);
    console.log(dataObjectiveByID);

    // console.log('data objek', completedKeyResults);


    const Percentage = () => {
        if (persentage.totalTargetValue > 0) {
            return ((persentage.totalCurrentValue / persentage.totalTargetValue) * 100).toFixed(0);
        }
        return 0;
    };

    // console.log(Percentage());

    // Langkah 1: Buat fungsi untuk mengonversi tanggal
    function convertDateFormat(inputDate) {
        if (typeof inputDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
            // Pastikan inputDate adalah string dengan format "YYYY-MM-DD"
            return null;
        }

        // Bagi tanggal menjadi komponen
        const dateComponents = inputDate.split('-');

        // Periksa apakah pembagian menghasilkan tiga komponen
        if (dateComponents.length !== 3) {
            return null;
        }

        // Dapatkan tahun, bulan, dan hari
        const year = dateComponents[0];
        const month = dateComponents[1];
        const day = dateComponents[2];

        // Buat string tanggal yang diformat "DD-MM-YYYY"
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }


    const tanggalYangBenar = convertDateFormat(dataProjek.start_date);
    const tanggalEnd = convertDateFormat(dataProjek.end_date);

    function calculatePercentage(targetValue, currentValue) {
        if (targetValue === 0) {
            return 0; // Hindari pembagian oleh nol
        }
        return ((currentValue / targetValue) * 100).toFixed(0); // Mengembalikan presentase dengan dua desimal
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const [formDataKey, setFormDataKey] = useState({
        id_objek: `${IDObjek}`,
        nama: '',
        file: null,
        link: '',
        days: '',
        assign_to: '',
        target_value: '',

    });
    console.log('a ', formDataKey);

    const handleInputChangeKey = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

            if (selectedFileEdit) {
                const objectUrl = URL.createObjectURL(selectedFileEdit);

                setFormDataKey({
                    ...formDataKey,
                    file: selectedFileEdit,
                });

                setImage(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormDataKey({
                    ...formDataKey,
                    file: null, // Atur nilai null saat tidak ada file yang dipilih
                });
                setImage(null); // Menampilkan pratinjau file yang dipilih

            }
            // } else if (name === 'id_objek') {
            //     setFormDataKey({
            //         ...formDataKey,
            //         id_objek: IDObjek,
            //     });
        } else {
            setFormDataKey({
                ...formDataKey,
                [name]: value,
                // id_objek: IDObjek,
            });
        }
    };

    // setFormDataKey({
    //     ...formDataKey,
    //     id_objek: IDObjek,
    // });

    console.log(formDataKey);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.post('http://localhost:3050/objektif', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data.newObjekti;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil Menambah Objektif!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/Objective/${id}`;
                    }
                });

                setSuccessMessage('Berhasil Menambah Objektif!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    const handleSubmitKey = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.post('http://localhost:3050/keyresult', formDataKey, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set header Content-Type
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data.newObjekti;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil Menambah Keyresult!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/Objective/${id}`;
                    }
                });

                setSuccessMessage('Berhasil Menambah Keyresult!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    const handleClick = (id) => {
        setIDObjek(id);
        setFormDataKey({ id_objek: id })
    }

    const [showEdit, setshowEdit] = useState(false); // Tambahkan state untuk popup pengeditan


    const [formDataEditObjek, setFormDataEditObjek] = useState({
        nama: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:3050/objektif/${IDObjek}`)
            .then((response) => {
                console.log('Data BY ID', response.data.objek);
                const Data = response.data.objek;

                setFormDataEditObjek({
                    nama: Data.nama,
                });



            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [IDObjek])

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setFormDataEditObjek({
            ...formDataEditObjek,
            [name]: value,
        });
    };

    console.log('formDataEditObjek', formDataEditObjek);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.put(`http://localhost:3050/objektif/${IDObjek}`, formDataEditObjek, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data.newObjekti;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil Mengedit Objektif!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/Objective/${id}`;
                    }
                });

                setSuccessMessage('Berhasil Mengedit Objektif!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };


    const [IDKeyResult, setIDKeyResult] = useState(null); // Menambahkan state data
    const [showEditKeyResult, setshowEditKeyResult] = useState(false); // Tambahkan state untuk popup pengeditan

    const handleClickEditKey = (id) => {
        setIDKeyResult(id);
        setshowEditKeyResult(true);
    }


    const [formDataEditKeyResult, setFormDataEditKeyResult] = useState({
        nama: '',
        file: null,
        link: '',
        assign_to: '',
        nama_profile: '',
        target_value: '',
        days: '',
    });

    console.log('IDKeyResult', IDKeyResult);

    useEffect(() => {
        axios.get(`http://localhost:3050/keyresult/${IDKeyResult}`)
            .then((response) => {
                console.log('Data keyresult BY ID ', response.data.keyresult);
                const Data = response.data.keyresult;
                    setFormDataEditKeyResult({
                        nama: Data.nama,
                        assign_to: Data.assign_to,
                        nama_profile: Data.nama_profile,
                        link: Data.link,
                        target_value: Data.target_value,
                        days: Data.days,
                    });


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [IDKeyResult])

    const handleEditChangeKey = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

            if (selectedFileEdit) {
                const objectUrl = URL.createObjectURL(selectedFileEdit);

                setFormDataEditKeyResult({
                    ...formDataEditKeyResult,
                    file: selectedFileEdit,
                });

                setImage(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormDataEditKeyResult({
                    ...formDataEditKeyResult,
                    file: null, // Atur nilai null saat tidak ada file yang dipilih
                });
                setImage(null); // Menampilkan pratinjau file yang dipilih

            }
            // } else if (name === 'id_objek') {
            //     setFormDataEditKeyResult({
            //         ...formDataEditKeyResult,
            //         id_objek: IDObjek,
            //     });
        } else {
            setFormDataEditKeyResult({
                ...formDataEditKeyResult,
                [name]: value,
                // id_objek: IDObjek,
            });
        }
    };
    console.log('formDataEditKeyResult', formDataEditKeyResult);

    const handleSubmitEditKey = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.put(`http://localhost:3050/keyresult/${IDKeyResult}`, formDataEditKeyResult, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set header Content-Type
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data.newObjekti;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil Mengedit Keyresult',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/Objective/${id}`;
                    }
                });

                setSuccessMessage('Berhasil Mengedit Keyresult');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    const handleDeleteKey = (itemId) => {
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
                    axios.delete(`http://localhost:3050/keyresult/${itemId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    })
                        .then(() => {
                            // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                            window.location.href = `/Objective/${id}`;

                            setData((prevData) => prevData.filter((teacher) => teacher._id !== itemId));
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                        })
                        .catch((error) => {
                            console.error('Terjadi kesalahan saat menghapus data:', error);
                        });
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

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
                    axios.delete(`http://localhost:3050/objektif/${itemId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    })
                        .then(() => {
                            // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                            window.location.href = `/Objective/${id}`;

                            setData((prevData) => prevData.filter((teacher) => teacher._id !== itemId));
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            );
                        })
                        .catch((error) => {
                            console.error('Terjadi kesalahan saat menghapus data:', error);
                        });
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };




    // todo  dllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllal

    return (
        <div className='flex w-full bg-gray-100/70 h-fit font-Poppins'>

            <div className="w-[260px]"></div>

            <div className="w-[1260px] mx-auto">

                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-5">
                    <NavLink to={'/OKR'} className={'font-semibold text-gray-600 flex mt-[30px]'}>
                        <span className="w-fit h-fit my-auto mr-5">
                            <BiArrowBack size={'20px'} />
                        </span>

                        Back To OKR
                    </NavLink>

                    <div className="w-full flex">
                        <div className="w-[700px] bg-white rounded-lg p-5 mt-[30px]">
                            {dataProjek ? (
                                <div>
                                    <h1 className="font-semibold text-xl mb-2">{dataProjek.nama}</h1>
                                    <h1 className="font-normal text-sm">{dataProjek.deskripsi}</h1>

                                    <div className="flex mt-10">
                                        <div className="w-[150px] h-[150px] bg-Merah-muda rounded-xl">
                                            <div className="w-7 h-7 rounded-full bg-Merah ml-3 mt-3 flex">
                                                <div className="text-white m-auto w-fit h-fit"><HiMiniChartBarSquare size={'20px'} /></div>
                                            </div>
                                            <h1 className="text-2xl font-semibold ml-3 mt-5">{dataObjective.length}</h1>
                                            <h1 className="text-sm font-normal ml-3 mt-4">Total Objektif</h1>
                                        </div>

                                        <div className="w-[150px] h-[150px] bg-cream rounded-xl ml-5">
                                            <div className="w-7 h-7 rounded-full bg-cream-Dark ml-3 mt-3 flex">
                                                <div className="text-white m-auto w-fit h-fit"><HiDocumentText size={'20px'} /></div>
                                            </div>
                                            <h1 className="text-2xl font-semibold ml-3 mt-5">{TotalKey}</h1>
                                            <h1 className="text-sm font-normal ml-3 mt-4">Key Result Aktif</h1>
                                        </div>

                                        <div className="w-[150px] h-[150px] bg-Hijau-muda rounded-xl ml-5">
                                            <div className="w-7 h-7 rounded-full bg-Hijau-tua ml-3 mt-3 flex">
                                                <div className="text-white m-auto w-fit h-fit"><BsCheckLg size={'20px'} /></div>
                                            </div>
                                            <h1 className="text-2xl font-semibold ml-3 mt-5">{completedKeyResults}</h1>
                                            <h1 className="text-sm font-normal ml-3 mt-1">Key Result Completed</h1>
                                        </div>

                                        <div className="w-[150px] h-[150px] bg-unggu-muda rounded-xl ml-5">
                                            <div className="w-7 h-7 rounded-full bg-unggu-tua ml-3 mt-3 flex">
                                                <div className="text-white m-auto w-fit h-fit"><BsFillPersonCheckFill size={'15px'} /></div>
                                            </div>
                                            <h1 className="text-2xl font-semibold ml-3 mt-5">{completedObjek}</h1>
                                            <h1 className="text-sm font-normal ml-3 mt-1">Objective Completed</h1>
                                        </div>
                                    </div>

                                    <div className="w-full flex mt-5">
                                        <div className="w-[320px] flex h-[60px] rounded-xl bg-gray-100/60">
                                            <div className="w-7 h-7 rounded-full flex bg-Merah ml-3 my-auto">
                                                <div className="text-white m-auto w-fit h-fit"><MdDateRange size={'20px'} /></div>
                                            </div>
                                            <div className="my-auto ml-3 ">
                                                <p className='text-gray-700 text-sm'>Tanggal Mulai</p>
                                                <p className='text-gray-900 text-sm font-semibold'>{tanggalYangBenar}</p>
                                            </div>
                                        </div>

                                        <div className="w-[320px] flex h-[60px] rounded-xl bg-gray-100/60 ml-auto ">
                                            <div className="w-7 h-7 rounded-full flex bg-Gold ml-3 my-auto">
                                                <div className="text-white m-auto w-fit h-fit"><MdDateRange size={'20px'} /></div>
                                            </div>
                                            <div className="my-auto ml-3 ">
                                                <p className='text-gray-700 text-sm'>Tanggal Selesai</p>
                                                <p className='text-gray-900 text-sm font-semibold'>{tanggalEnd}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>

                        <div className="w-[470px] ml-auto mt-[30px]">
                        <div className="bg-white flex h-[100px] rounded-lg p-3 w-full  mb-[30px]">
                                <div className="w-full h-fit m-auto">
                                    <h1 className={`text-3xl ${Percentage() === '100' ? "text-Hijau-tua" : "text-Gold"}`}>{Percentage()}%</h1>
                                    <div className="w-[98%] mx-auto mt-2 h-3 bg-gray-100 rounded-xl">
                                        <div className={`h-3 rounded-xl ${Percentage() === '100' ? "bg-Hijau-tua" : "bg-Gold"}`} style={{ width: `${Percentage()}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white w-full h-[236px]  rounded-lg p-3 ">
                                <p className="font-semibold">Tim Projek</p>
                                <div className="overflow-y-scroll w-full h-[176px] mt-3">
                                    <div className="w-full h-fit ">
                                        {datatim ? (
                                            datatim.map((Tim) => (
                                                <div key={Tim._id}
                                                    className="h-16 flex">
                                                    <img src={`http://localhost:9000/okr.profile/${Tim.foto}`}
                                                        className='w-12 h-12 my-auto rounded-full' />
                                                    <div className="my-auto ml-3 w-full">
                                                        <p className='font-semibold w-fit'>{Tim.nama}</p>
                                                        <p className='font-light text-gray-500'>{Tim.divisi}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div>Loading...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-[30px] flex">
                        <h1 className="font-bold w-fit h-fit my-auto">Objektif</h1>

                        {userRole === 'Admin' && (
                            <div className="bg-unggu w-[210px] p-1 rounded-xl ml-auto h-10 flex cursor-pointer" onClick={() => setshowTambah(true)}>
                                <div className="w-fit h-fit flex m-auto">
                                    <div className="text-white w-fit h-fit my-auto">
                                        <IoIosAddCircle size={'30px'} />
                                    </div>
                                    <p className='text-white w-fit h-fit my-auto font-semibold ml-2'>Tambah Objektif</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-[30px] w-full">
                        {Array.isArray(dataObjective) ? (
                            dataObjective.map((objek, index) => (
                                <div key={objek._id} className="w-[585px] h-fit p-5 bg-white rounded-lg">
                                    <div className="flex w-full mt-1">
                                        <p className='font-semibold text-xl text-unggu'>Objektif {index + 1}</p>
                                        <div className={`h-8 w-24 flex my-auto ml-auto rounded-xl ${objek.status == "Progress" ? "bg-Gold" : objek.status === "Selesai" ? "bg-Hijau-tua" : "bg-Gold"}`}>
                                            <p className='m-auto w-fit text-white font-semibold h-fit'>{objek.status}</p>
                                        </div>
                                        <div className='relative w-fit h-fit flex mx-2 my-auto'>
                                            {userRole === 'Admin' && (

                                                <div className="w-fit m-auto cursor-pointer" onClick={() => {
                                                    handleClick(objek._id);
                                                    setshowEditDanApus({ [objek._id]: true });
                                                }}>
                                                    <BsThreeDotsVertical size={'20px'} />
                                                </div>
                                            )}

                                            {showEditDanApus[objek._id] && (
                                                <div className="absolute inset-0 p-3 items-center justify-center z-10 w-[170px] h-fit shadow-lg shadow-black/20 bg-white -left-[150px] rounded-xl top-[30px] border " >
                                                    <div className="flex">
                                                        <p className='font-semibold'>Detail</p>
                                                        <div className="w-fit h-fit ml-auto text-xs cursor-pointer" onClick={() => setshowEditDanApus(false)}>
                                                            X
                                                        </div>
                                                    </div>

                                                    <div className="flex w-full mt-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2" onClick={() => {
                                                        setshowTambahKey(true);
                                                        // setIDObjek(objek._id);
                                                    }}>
                                                        <span className=" my-auto">
                                                            <IoIosAddCircleOutline size={'20px'} />
                                                        </span>

                                                        <p className="ml-2 my-auto">Key Result</p>
                                                    </div>

                                                    <hr className="my-3 w-[160px] -ml-2 " />


                                                    <div className="flex w-full cursor-pointer hover:bg-gray-100 rounded-lg p-2" onClick={() => setshowEdit(true)}>
                                                        <span className=" my-auto">
                                                            <BiPencil size={'20px'} />
                                                        </span>

                                                        <p className="ml-2 my-auto">Edit</p>
                                                    </div>

                                                    <hr className="my-3 w-[160px] -ml-2 " />

                                                    <div className="flex w-full cursor-pointer text-red-500 hover:bg-gray-100 rounded-lg p-2" onClick={() => handleDelete(IDObjek)}>
                                                        <span className=" my-auto">
                                                            <RiDeleteBin5Line size={'20px'} />
                                                        </span>

                                                        <p className="ml-2 my-auto">Hapus</p>
                                                    </div>

                                                    <div className="w-full h-1"></div>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className=' text-lg mt-6'>{objek.nama}</p>
                                    <div className="overflow-y-scroll w-full max-h-[575px] h-fit mt-3">
                                        {/* Merender dataKeyResult yang sesuai dengan objek saat ini */}
                                        {Array.isArray(dataKeyResult) && dataKeyResult.length > 0 ? (
                                            dataKeyResult.some((keyResultSet, objekIndex) => {
                                                return keyResultSet.some((Resul, ResulIndex) => Resul.id_objek === objek._id);
                                            }) ? (
                                                dataKeyResult.map((keyResultSet, objekIndex) => (
                                                    keyResultSet.map((Resul, ResulIndex) => {

                                                        // Periksa apakah dataKeyResult terkait dengan objek saat ini
                                                        if (Resul.id_objek === objek._id) {
                                                            // Hitung presentase
                                                            const percentage = calculatePercentage(Resul.target_value, Resul.current_value);

                                                            const getPercentageColorBG = () => {
                                                                if (percentage >= 100) {
                                                                    return 'bg-Hijau-tua'; // Ganti dengan warna hijau yang Anda inginkan
                                                                } else {
                                                                    return 'bg-Gold'; // Ganti dengan warna lain jika persentase kurang dari 100%
                                                                }
                                                            };
                                                            const getPercentageColor = () => {
                                                                if (percentage >= 100) {
                                                                    return 'text-Hijau-tua'; // Ganti dengan warna hijau yang Anda inginkan
                                                                } else {
                                                                    return 'text-Gold'; // Ganti dengan warna lain jika persentase kurang dari 100%
                                                                }
                                                            };


                                                            return (
                                                                <div key={`keyresult-${ResulIndex}`} className="w-full h-fit p-5 bg-gray-100/70 mt-5 rounded-lg">
                                                                    <div className="flex w-full h-fit">
                                                                        <p className='font-semibold text-xl text-unggu'>Key Result {ResulIndex + 1}</p>

                                                                        {userRole === 'Admin' && (
                                                                            <span className='h-[32px] w-[32px] flex p-1 ml-3 border rounded-full my-auto border-blue-500 cursor-pointer hover:bg-blue-500 text-blue-500 hover:text-white transition-all duration-500'
                                                                                onClick={() => handleClickEditKey(Resul._id)}>
                                                                                <BiPencil size={'20px'} className='w-fit h-fit m-auto' />
                                                                            </span>
                                                                        )}

                                                                        {userRole === 'Admin' && (
                                                                            <span className='h-[32px] w-[32px] flex p-1 ml-3 border rounded-full my-auto border-red-500 cursor-pointer hover:bg-red-500 text-red-500 hover:text-white transition-all duration-500'
                                                                                onClick={() => handleDeleteKey(Resul._id)}>
                                                                                <RiDeleteBin5Line size={'20px'} className='w-fit h-fit m-auto' />
                                                                            </span>
                                                                        )}


                                                                        <img src={`http://localhost:9000/okr.profile/${Resul.foto_profile}`}
                                                                            className='w-8 h-8 ml-auto my-auto rounded-full' />

                                                                    </div>
                                                                    <p className='text-gray-500 my-5'>{Resul.nama}</p>
                                                                    <p className='text-gray-500 my-5'>{Resul.target_value}/{Resul.days}</p>


                                                                    <div className="w-full h-fit flex">
                                                                        <div className="w-8 h-8 rounded-full flex bg-gray-200 my-auto">
                                                                            <div className="text-black m-auto w-fit h-fit">
                                                                                <a href={`http://localhost:9000/okr.keyresult/${Resul.file}`} target="_blank">
                                                                                    <HiOutlineDocumentText size={'20px'} />
                                                                                </a>
                                                                            </div>
                                                                        </div>

                                                                        <div className="w-8 h-8 rounded-full flex ml-3 bg-gray-200 my-auto">
                                                                            <div className="text-black m-auto w-fit h-fit">
                                                                                <a href={`https://${Resul.link}`} target="_blank">
                                                                                    <BsLink45Deg size={'20px'} />
                                                                                </a>
                                                                            </div>

                                                                        </div>

                                                                        <div className="w-8 h-8 rounded-full flex ml-3 bg-gray-200 my-auto">
                                                                            <div className="text-black m-auto w-fit h-fit">
                                                                                <NavLink to={`/KeyResult/${Resul._id}`} className="text-black m-auto w-fit h-fit">
                                                                                    <AiOutlineEye size={'20px'} />
                                                                                </NavLink>
                                                                            </div>
                                                                        </div>

                                                                        <div className={`h-8 w-24 flex my-auto ml-3 rounded-xl ${Resul.status == "Progress" ? "bg-Gold" : Resul.status === "Selesai" ? "bg-Hijau-tua" : "bg-Gold"}`}>
                                                                            <p className='m-auto w-fit text-white font-semibold h-fit'>{Resul.status}</p>
                                                                        </div>

                                                                        <p className={`w-fit font-semibold h-fit ml-auto text-2xl my-auto ${getPercentageColor(percentage)}`}>{percentage}%</p>
                                                                    </div>

                                                                    <div className="h-2 w-full bg-gray-200/80 rounded-xl mt-10">
                                                                        <div className={`${getPercentageColorBG(percentage)}`} style={{ width: `${percentage}%`, height: '8px', borderRadius: '12px', }} ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        } return null; // Kembalikan null jika tidak ada data yang sesuai
                                                    })
                                                ))
                                            ) : (
                                                <div>Belom ada key result</div>
                                            )
                                        ) : (
                                            <div>Belom ada key result</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Belom ada objektif dan key restult</div>
                        )}
                    </div>

                    {showTambah && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Tambah Objektif</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowTambah(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">
                                        <form action="" onSubmit={handleSubmit} className=''>
                                            <div className=" w-full">
                                                <div className='mb-2'>
                                                    <label htmlFor="" className='ml-2'>Nama</label><br />
                                                    <input type="text" name='nama' placeholder='Nama' onChange={handleInputChange}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Tambah Objektif"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </div>


                                        </form>

                                    </div>

                                </div>

                            </div>
                        </div>

                    )}


                    {showEdit && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                        <h1>Edit Objektif</h1>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowEdit(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">
                                        <form action="" onSubmit={handleSubmitEdit} className=''>
                                            <div className=" w-full">
                                                <div className='mb-2'>
                                                    <label htmlFor="" className='ml-2'>Nama</label><br />
                                                    <input type="text" name='nama' placeholder='Nama' value={formDataEditObjek.nama} onChange={handleInputChangeEdit}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Edit Objektif"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </div>


                                        </form>

                                    </div>

                                </div>

                            </div>
                        </div>

                    )}

                    {showEditKeyResult && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-[300px] h-14 my-auto ml-5 flex'>
                                        <div className="flex w-10 h-10 my-auto bg-gray-100 rounded-full">
                                            <span className="w-fit h-fit m-auto"><HiOutlineViewGridAdd size={'25px'} /></span>
                                        </div>

                                        <div className="w-fit h-fit my-auto ml-2">
                                            <h1 className="font-semibold text-lg ">Edit Key Result</h1>
                                            <p className="text-xs">Objektiv : {dataObjectiveByID.nama}</p>
                                        </div>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowEditKeyResult(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">

                                        {/* <div>{IDObjek}</div> */}

                                        <form action="" onSubmit={handleSubmitEditKey} className=''>
                                            <div className=" w-full">


                                                <div className='mb-2'>
                                                    <input type="text" name='nama' placeholder='Nama' value={formDataEditKeyResult.nama} onChange={handleEditChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <select name="assign_to" onChange={handleEditChangeKey}
                                                        className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" >
                                                        <option value={formDataEditKeyResult.assign_to}>{formDataEditKeyResult.nama_profile}</option>
                                                        {datatim.map((tim) => (
                                                            <option key={tim._id} value={tim._id}>
                                                                {tim.nama} / {tim.divisi}

                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='target_value' value={formDataEditKeyResult.target_value} placeholder='Target value' onChange={handleEditChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='days' value={formDataEditKeyResult.days} placeholder='days' onChange={handleEditChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleEditChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />

                                                    <div className="flex">
                                                        <div className="px-2 py-2 flex bg-gray-200 mt-1 w-[50px] h-[41px] rounded-md font-mono text-black text-base mx-auto mb-1">
                                                            <div className="w-fit h-fit m-auto">
                                                                <AiFillFolderAdd size={'20px'} />
                                                            </div>
                                                        </div>

                                                        <div className="px-2 py-2 ml-3 bg-gray-200 mt-1 h-[41px] flex rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                                                            {image && (
                                                                <div className="my-auto w-fit h-fit text-gray-400 text-xs">
                                                                    {image}
                                                                </div>
                                                            )}

                                                            <div className="ml-auto my-auto mr-2 cursor-pointer"
                                                                onClick={() => document.getElementById('file-input').click()}>
                                                                <IoIosAddCircleOutline size={'20px'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mb-2'>
                                                    <div className="flex">
                                                        <div className="px-2 py-2 flex bg-gray-200 mt-1 w-[50px] h-[41px] rounded-md font-mono text-black text-base mx-auto mb-1">

                                                            <div className="w-fit h-fit m-auto">
                                                                <AiOutlineLink size={'20px'} />
                                                            </div>
                                                        </div>
                                                        <input type="text" name='link' placeholder='Add Link' value={formDataEditKeyResult.link} onChange={handleEditChangeKey}
                                                            className="px-2 py-3 ml-3  bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Edit Keyresult"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </div>


                                        </form>

                                    </div>

                                </div>

                            </div>
                        </div>

                    )}


                    {showTambahKey && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-[300px] h-14 my-auto ml-5 flex'>
                                        <div className="flex w-10 h-10 my-auto bg-gray-100 rounded-full">
                                            <span className="w-fit h-fit m-auto"><HiOutlineViewGridAdd size={'25px'} /></span>
                                        </div>

                                        <div className="w-fit h-fit my-auto ml-2">
                                            <h1 className="font-semibold text-lg ">Tambah Key Result</h1>
                                            <p className="text-xs">Objektiv : {dataObjectiveByID.nama}</p>
                                        </div>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowTambahKey(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">

                                        {/* <div>{IDObjek}</div> */}

                                        <form action="" onSubmit={handleSubmitKey} className=''>
                                            <div className=" w-full">

                                                <div className='mb-2 hidden'>
                                                    <input type="text" name='id_objek' placeholder='Nama' onChange={handleInputChangeKey} value={dataObjectiveByID._id}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='nama' placeholder='Nama' onChange={handleInputChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <select name="assign_to" onChange={handleInputChangeKey}
                                                        className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" >
                                                        <option value="">Pilih Assign to</option>
                                                        {datatim.map((tim) => (
                                                            <option key={tim._id} value={tim._id}>
                                                                {tim.nama} / {tim.divisi}

                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='target_value' placeholder='Target value' onChange={handleInputChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='days' placeholder='days ' onChange={handleInputChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleInputChangeKey}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />

                                                    <div className="flex">
                                                        <div className="px-2 py-2 flex bg-gray-200 mt-1 w-[50px] h-[41px] rounded-md font-mono text-black text-base mx-auto mb-1">
                                                            <div className="w-fit h-fit m-auto">
                                                                <AiFillFolderAdd size={'20px'} />
                                                            </div>
                                                        </div>

                                                        <div className="px-2 py-2 ml-3 bg-gray-200 mt-1 h-[41px] flex rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                                                            {image && (
                                                                <div className="my-auto w-fit h-fit text-gray-400 text-xs">
                                                                    {image}
                                                                </div>
                                                            )}

                                                            <div className="ml-auto my-auto mr-2 cursor-pointer"
                                                                onClick={() => document.getElementById('file-input').click()}>
                                                                <IoIosAddCircleOutline size={'20px'} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mb-2'>
                                                    <div className="flex">
                                                        <div className="px-2 py-2 flex bg-gray-200 mt-1 w-[50px] h-[41px] rounded-md font-mono text-black text-base mx-auto mb-1">

                                                            <div className="w-fit h-fit m-auto">
                                                                <AiOutlineLink size={'20px'} />
                                                            </div>
                                                        </div>
                                                        <input type="text" name='link' placeholder='Add Link' onChange={handleInputChangeKey}
                                                            className="px-2 py-3 ml-3  bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Tambah Keyresult"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </div>


                                        </form>

                                    </div>

                                </div>

                            </div>
                        </div>

                    )}

                </div>

                <div className='h-[70px] '></div>
            </div>
        </div >
    )
}
