import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

import { IoIosAddCircle } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { GrDocumentUpdate } from "react-icons/gr";


export const OKR = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [dataProjek, setdataProjek] = useState(null); // Menambahkan state data
    const [dataProjekNONDRAFT, setdataProjekNONDRAFT] = useState(null); // Menambahkan state data
    const [datatim, setdatatim] = useState(null); // Menambahkan state data
    const [Alldatatim, setAlldatatim] = useState([]); // Menambahkan state data
    const [selectedTim, setSelectedTim] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [formData, setFormData] = useState({
        nama: '',
        deskripsi: '',
        start_date: '',
        end_date: '',
        team: [],
    });

    const [selectedStatus, setSelectedStatus] = useState(''); // State untuk menyimpan status yang dipilih
    const [filteredProjek, setFilteredProjek] = useState([]);

    const [selectedQuarter, setSelectedQuarter] = useState('');
    const [persentage, setPersentage] = useState(0);
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [showEditDanApus, setshowEditDanApus] = useState({}); // Tambahkan state untuk popup pengeditan
    const [showTambah, setshowTambah] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showTambah2, setshowTambah2] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showEdit, setshowEdit] = useState(false); // Tambahkan state untuk popup pengeditan
    const [IDObjek, setIDObjek] = useState(null); // Menambahkan state data
    const [dataProjekBYID, setdataProjekBYID] = useState(null); // Menambahkan state data


    const getQuarterdate = (startDate, endDate) => {
        const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
        const startQuarter = quarterNames[Math.floor(startDate.getMonth() / 3)];
        const endQuarter = quarterNames[Math.floor(endDate.getMonth() / 3)];
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        return `${startQuarter} ${startYear} - ${endQuarter} ${endYear}`;
    };





    useEffect(() => {
        // Pastikan peran pengguna telah diambil dari local storage
        const role = localStorage.getItem('role');
        setUserRole(role);

        // Cek apakah token tersimpan di Local Storage
        const token = localStorage.getItem('token');
        if (token) {
            // todo console.log('Token ditemukan:', token);

            axios.get('http://localhost:3050/projek/non/draft')
                .then((response) => {
                    // Mengisi opsi kategori dengan data dari server
                    // console.log(response.data.profileData);
                    setdataProjekNONDRAFT(response.data.draftprojek);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

            axios.get('http://localhost:3050/profile/all')
                .then((response) => {
                    // Mengisi opsi kategori dengan data dari server
                    // console.log(response.data.profileData);
                    setAlldatatim(response.data.profileData);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                });

            axios.get('http://localhost:3050/projek').then((response) => {
                //  Mengisi opsi kategori dengan data dari server

                // console.log(response.data.projekData);
                setdataProjek(response.data.projekData)
                // Mendapatkan data tim
                const teamIds = response.data.projekData.map((Projek) => Projek.team).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik
                const idprojek = response.data.projekData.map((Projek) => Projek._id).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik

                // console.log('id', idprojek);
                // Lakukan permintaan HTTP untuk setiap ID tim dan simpan hasilnya
                const projek = idprojek.map(async (projek) => {
                    return axios.get(`http://localhost:3050/keyresult/projek/${projek}/values`)
                        .then((teamResponse) => teamResponse.data)
                        .catch((teamError) => {
                            console.error('Terjadi kesalahan saat mengambil data tim:', teamError);
                            return null; // Mengembalikan null jika ada kesalahan
                        });
                });
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
                    // console.log(teamData);
                    // Disimpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setdatatim(teamData.filter((data) => data !== null));

                });

                Promise.all(projek).then((teamData) => {
                    // teamData berisi data tim untuk setiap ID tim, termasuk null untuk kesalahan
                    // console.log(teamData);

                    // Mengganti nilai null dengan 0
                    const sanitizedData = teamData.map((data) => (data !== null ? data : 0));

                    // Simpan dalam state datatim (pastikan untuk melakukan validasi data)
                    setPersentage(sanitizedData);

                    // Contoh menggunakan map untuk mengakses setiap data dalam array
                    sanitizedData.map((data, index) => {
                        // console.log(`Data ke-${index}:`, data);
                        // Lakukan operasi lain pada data di sini
                    });
                });


            }).catch((error) => {
                // ! jika token tidak ada
                console.error('Terjadi kesalahan:', error);
            });



            // axios.get('http://localhost:3050/profile/profile/${teamIds}').then((response) => {
            //     //  Mengisi opsi kategori dengan data dari server

            //  console.log(response);
            //     // setdatatim(response.data.projekData.team)
            // }).catch((error) => {
            //     // ! jika token tidak ada
            //     console.error('Terjadi kesalahan:', error);
            // });

        } else {
            console.log('Token tidak ditemukan');
        }
    }, []);
    //  Parameter kedua [] memastikan bahwa useEffect hanya dijalankan sekali saat komponen pertama kali di-render




    // console.log(dataProjek);
    // console.log('data tim', datatim);

    const getTimName = (timId) => {
        if (datatim) {
            const tim = datatim.find((data) => data._id === timId);
            if (tim) {
                return tim.foto ? `http://localhost:9000/okr.profile/${tim.foto}` : 'Tidak Ada Foto';
            }
        }
        return 'Tim Tidak Ditemukan';
    };


    // const getQuarter = (startDate, endDate) => {
    //     const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
    //     const startMonth = startDate.getMonth() + 1;
    //     const endMonth = endDate.getMonth() + 1;

    //     // Hitung Quarter untuk bulan awal dan bulan akhir
    //     const startQuarter = quarterNames[Math.floor((startMonth - 1) / 3)];
    //     const endQuarter = quarterNames[Math.floor((endMonth - 1) / 3)];

    //     return `${startQuarter} - ${endQuarter}`;
    // };




    // Filter data proyek berdasarkan Quarter yang dipilih
    useEffect(() => {
        const filteredData = dataProjek
            ? dataProjek.filter((Projek) => {
                // Lakukan filter berdasarkan status yang dipilih
                if (!selectedQuarter) {
                    // Jika belum ada Quarter yang dipilih, tampilkan semua proyek
                    return true;
                } else {
                    // Jika ada Quarter yang dipilih, tampilkan proyek sesuai Quarter
                    const quarterCreated = getQuarterdate(new Date(Projek.start_date), new Date(Projek.end_date));
                    return quarterCreated === selectedQuarter;
                }
            })
            : [];

        // Filter berdasarkan status yang dipilih
        const filteredByStatus = selectedStatus
            ? filteredData.filter((Projek) => Projek.status === selectedStatus)
            : filteredData;

        setFilteredProjek(filteredByStatus);
    }, [dataProjek, selectedQuarter, selectedStatus]);



    function calculatePercentage(targetValue, currentValue) {
        if (targetValue === 0 || targetValue === null) {
            return 0; // Hindari pembagian oleh nol atau null
        }

        if (currentValue === null) {
            currentValue = 0; // Ubah null menjadi 0 jika currentValue null
        }

        return ((currentValue / targetValue) * 100).toFixed(0); // Mengembalikan presentase dengan dua desimal
    }

    const percentages = persentage ? persentage.map(data => calculatePercentage(data.totalTargetValue || 0, data.totalCurrentValue || 0)) : [];

    // console.log('peresen', percentages);




    // if (checked) {
    //     setFormData({
    //         ...setFormData,
    //         team: [...prevFormData.team, value],
    //     });
    // } else {
    //     setFormData({
    //         ...setFormData,
    //         team: setFormData.team.filter((team) => team !== value),
    //     });
    // }





    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    // Filter daftar tim berdasarkan kata kunci pencarian
    const filteredTim = Alldatatim.filter((tim) => {
        const lowerCaseKeyword = searchKeyword.toLowerCase();
        return (
            tim.nama.toLowerCase().includes(lowerCaseKeyword) || // Mencari berdasarkan nama
            tim.divisi.toLowerCase().includes(lowerCaseKeyword) // Mencari berdasarkan divisi
        );
    });

    // Tindakan ketika elemen diklik
    const handleClick = (value) => {
        const updatedSelectedTim = selectedTim.includes(value)
            ? selectedTim.filter((tim) => tim !== value)
            : [...selectedTim, value];
        setSelectedTim(updatedSelectedTim);

        setFormData((prevFormData) => ({
            ...formData,
            team: updatedSelectedTim,
        }));
        setFormDataEdit((prevFormData) => ({
            ...formDataEdit,
            team: updatedSelectedTim,
        }));

    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            // Tambahkan tim ke formData jika belum ada dalam formData
            if (!formData.team.includes(value)) {
                setFormData((prevFormData) => ({
                    ...formData,
                    team: [...prevFormData, value],
                }));
            }
        } else {
            // Hapus tim dari formData jika ada dalam formData
            if (formData.team.includes(value)) {
                setFormData((prevFormData) => ({
                    ...formData,
                    team: prevFormData.filter((tim) => tim !== value),
                }));
            }
        }
    };




    console.log('selectedQuarter', selectedQuarter);




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    console.log('tim', selectedTim);


    // if (formData.team.length > 1) {
    //     setFormData({
    //     ...formData,
    //     team: selectedTim
    // })
    // }

    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.post('http://localhost:3050/projek', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil menambahkan projek!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/OKR';
                    }
                });

                setSuccessMessage('Berhasil menambahkan projek!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
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
                    axios.delete(`http://localhost:3050/projek/${itemId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    })
                        .then(() => {
                            // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                            // window.location.href = `/OKR`;

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

    const handleUP = (itemId) => {
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
                confirmButtonText: 'Yes, Draft it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`http://localhost:3050/projek/public/${itemId}/up`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    })
                        .then(() => {
                            // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                            window.location.href = `/OKR`;

                            setData((prevData) => prevData.filter((teacher) => teacher._id !== itemId));
                            Swal.fire(
                                'Drafted!',
                                'Your file has been Drafted.',
                                'success'
                            );
                        })
                        .catch((error) => {
                            console.error('Terjadi kesalahan saat MengDraft data:', error);
                        });
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };
    const handleDRaft = (itemId) => {
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
                confirmButtonText: 'Yes, Draft it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`http://localhost:3050/projek/status/${itemId}/draft`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Set header Content-Type
                        },
                    })
                        .then(() => {
                            // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
                            window.location.href = `/OKR`;

                            setData((prevData) => prevData.filter((teacher) => teacher._id !== itemId));
                            Swal.fire(
                                'Drafted!',
                                'Your file has been Drafted.',
                                'success'
                            );
                        })
                        .catch((error) => {
                            console.error('Terjadi kesalahan saat MengDraft data:', error);
                        });
                }
            });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };

    const handleClickID = (id) => {
        setIDObjek(id);
        setshowEditDanApus({ [id]: true });
        // setFormDataKey({ id_objek: id })
    }
    const handleClickEdit = (id) => {
        setshowEdit(true);
    }

    const [formDataEdit, setFormDataEdit] = useState({
        nama: '',
        deskripsi: '',
        start_date: '',
        end_date: '',
        team: [],
    });

    useEffect(() => {
        axios.get(`http://localhost:3050/projek/${IDObjek}`)
            .then((response) => {
                console.log('Data BY ID', response.data.projek);
                const Data = response.data.projek;
                console.log('DATA', Data);

                // Inisialisasi selectedTim dengan ID tim yang ada di formDataEdit
                const initialSelectedTim = Data.team.map((tim) => tim._id);

                setFormDataEdit({
                    nama: Data.nama,
                    deskripsi: Data.deskripsi,
                    start_date: Data.start_date,
                    end_date: Data.end_date,
                    team: Data.team,
                });

                // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih



            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [IDObjek]);

    console.log('dataProjekNONDRAFT', dataProjekNONDRAFT);
    const filteredDataBYID = dataProjekNONDRAFT ? dataProjekNONDRAFT.filter((task) => {
        if (selectedStatus === '') {
            return true; // Tampilkan semua tugas jika tidak ada status yang dipilih.
        }
        return task.status === selectedStatus;
    }) : [];




    // useEffect(() => {
    //     axios.get(`http://localhost:3050/projek/${IDObjek}`)
    //         .then((response) => {
    //             // Mengisi opsi kategori dengan data dari server
    //             console.log('ID projek', response.data.projek);
    //             // setLastProgres(response.data.projek);

    //             setdataProjekBYID(response.data.projek);

    //             const Data = response.data.projek;
    //             if (!formDataEdit.nama) {
    //                 setFormDataEdit({
    //                     nama: Data.nama,
    //                     deskripsi: Data.deskripsi,
    //                     start_date: Data.start_date,
    //                     end_date: Data.end_date,
    //                     team: Data.team,
    //                 });
    //             }

    //         })
    //         .catch((error) => {
    //             console.error('Terjadi kesalahan:', error);
    //         });
    // }, [IDObjek]);

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setFormDataEdit({
            ...formDataEdit,
            [name]: value,
        });
    };

    // Gunakan useEffect untuk menginisialisasi selectedTim dari formDataEdit.team
    useEffect(() => {
        if (formDataEdit.team) {
            setSelectedTim(formDataEdit.team);
        }
    }, [formDataEdit.team]);

    const handleCheckboxChangeEdit = (event) => {
        const timId = event.target.value;
        if (selectedTim.includes(timId)) {
            // Deselect tim
            setSelectedTim(selectedTim.filter((id) => id !== timId));
        } else {
            // Select tim
            setSelectedTim([...selectedTim, timId]);
        }
    };

    //   const handleCheckboxChangeEdit = (event) => {
    //     const selectedTimId = event.target.value;
    //     if (selectedTim.includes(selectedTimId)) {
    //       // Tim sudah ada di selectedTim, maka hilangkan dari selectedTim
    //       setSelectedTim(selectedTim.filter((timId) => timId !== selectedTimId));
    //     } else {
    //       // Tim belum ada di selectedTim, tambahkan ke selectedTim
    //       setSelectedTim([...selectedTim, selectedTimId]);
    //     }
    //   };



    console.log('IDObjek', IDObjek);
    console.log('formDataEdit', formDataEdit);



    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            const response = await axios.put(`http://localhost:3050/projek/${IDObjek}`, formDataEdit, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Berhasil Mengedit Projek!',
                    icon: 'success',
                    confirmButtonText: 'OKE',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/OKR';
                    }
                });

                setSuccessMessage('Berhasil Mengedit Projek!');
            } else {
                console.error('Pendaftaran gagal');

                Swal.fire('Error', 'Pendaftaran gagal', 'error');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };


    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

            <div className="w-[260px] lg:block hidden"></div>

            <div className="lg:w-[1260px] mx-auto w-full">

                <div className='h-[70px]'></div>

                <div className="lg:w-[1200px] w-full mx-auto mt-5">

                    <div className="lg:flex hidden lg:w-full w-[95%] mx-auto">
                        {/* Dropdown seleksi kuartal */}
                        <select
                            name=""
                            className='lg:w-[200px] w-[160px] h-10 p-1 shadow-lg rounded-lg hidden'
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                        >
                            <option value="">Semua Quarter</option>
                            <option value="Q1">Q1</option>
                            <option value="Q2">Q2</option>
                            <option value="Q3">Q3</option>
                            <option value="Q4">Q4</option>
                        </select>

                        {userRole === 'Admin' || userRole === 'Menejemen' ? (
                            <div className="">
                                <select name="status" className='lg:w-[200px] w-[150px] h-10 p-1 shadow-lg rounded-lg ml-2 lg:ml-5'
                                onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
                                <option value="">Semua Status</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Progres">Progres</option>
                                <option value="Draft">Draft</option>
                            </select>
                            </div>

                        ) : (
                            <select name="status" className='lg:w-[200px] w-[150px] h-10 p-1 shadow-lg rounded-lg ml-2 lg:ml-5'
                                onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
                                <option value="">Semua Status</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Progres">Progres</option>
                            </select>
                        )}

                        {/* Hanya tampilkan elemen jika peran pengguna adalah "admin" */}
                        {userRole === 'Admin' && (
                            <div className="bg-unggu lg:w-[180px] w-fit p-1 rounded-xl ml-auto h-10 lg:flex hidden cursor-pointer" onClick={() => setshowTambah(true)}>
                                <div className="w-fit h-fit flex m-auto">
                                    <div className="text-white w-fit h-fit my-auto" >
                                        <IoIosAddCircle size={'30px'} />
                                    </div>
                                    <p className='text-white w-fit h-fit my-auto font-semibold ml-2 lg:block hidden'>Tambah Projek</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {userRole === 'Admin' && (
                        <div className="fixed bottom-3 z-10 right-3 bg-unggu lg:w-[180px] h-fit w-fit p-1 rounded-xl ml-auto flex lg:hidden cursor-pointer" onClick={() => setshowTambah2(true)}>
                            <div className="w-fit h-fit flex m-auto">
                                <div className="text-white w-fit h-fit my-auto" >
                                    <IoIosAddCircle size={'50px'} />
                                </div>
                                <p className='text-white w-fit h-fit my-auto font-semibold ml-2 lg:block hidden'>Tambah Projek</p>
                            </div>
                        </div>
                    )}

                    <div className="lg:w-full w-[95%] mx-auto mt-10">
                        <div className='lg:flex w-full h-[60px] hidden bg-white shadow rounded-lg'>
                            <span className="lg:ml-5 my-auto lg:w-[300px]">
                                <p className="text-gray-400 font-semibold">PROJEK</p>
                            </span>

                            <span className="lg:ml-5 my-auto lg:w-[170px] ">
                                <p className="text-gray-400 font-semibold">ANGGOTA</p>
                            </span>

                            <span className="lg:ml-5 my-auto lg:w-[125px] ">
                                <p className="text-gray-400 font-semibold">QUARTER</p>
                            </span>

                            <span className="lg:ml-8 my-auto lg:w-[135px]">
                                <p className="text-gray-400 font-semibold">STATUS</p>
                            </span>

                            <span className="lg:ml-5 my-auto lg:w-[280px]">
                                <p className="text-gray-400 font-semibold">PENYELESAIAN</p>
                            </span>
                        </div>
                        {userRole === 'Admin' || userRole === 'Menejemen' ? (

                            <div className="w-full h-fit">
                                {filteredProjek ? (
                                    filteredProjek.map((Projek, index) => (

                                        <div key={Projek._id} className='flex relative lg:static w-full lg:h-[100px] h-[200px] mt-5 bg-white shadow rounded-lg'>
                                            <NavLink to={`/Objective/${Projek._id}`} className='lg:flex w-full lg:h-[100px] p-4 h-[200px] rounded-lg'>
                                                <div className="lg:ml-5 lg:my-auto lg:w-[300px] lg:block flex w-full ">
                                                    <p className="lg:text-base text-xl font-semibold">{Projek.nama}</p>
                                                </div>

                                                <div className="lg:hidden my-auto w-[150px]">
                                                    {/* <p className="text-gray-400 font-semibold">
                                                        START QUARTER - END QUARTER
                                                    </p> */}
                                                    <p className='text-xs font-medium'>{getQuarterdate(new Date(Projek.start_date), new Date(Projek.end_date))}</p>
                                                </div>

                                                <span className="ml-5 my-auto w-[170px] lg:block  hidden">
                                                    <div className="text-gray-400 flex font-semibold">
                                                        {Projek.team.slice(0, 4).map((tim, index) => (
                                                            <div className="flex -mr-5" key={tim}>
                                                                <img className='w-10 h-10 border-2 border-white rounded-[100%]' src={getTimName(tim)} alt="" />
                                                            </div>
                                                        ))}
                                                        {Projek.team.length > 4 && (
                                                            <div className="-ml-1 my-auto flex rounded-[100%] w-10 h-10 bg-unggu-tua text-white">
                                                                <p className="w-fit h-fit m-auto">
                                                                    +{Projek.team.length - 4}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </span>

                                                <span className="ml-5 my-auto w-[125px] lg:block hidden">
                                                    {/* <p className="text-gray-400 font-semibold">
                                                        START QUARTER - END QUARTER
                                                    </p> */}
                                                    <p>{getQuarterdate(new Date(Projek.start_date), new Date(Projek.end_date))}</p>
                                                </span>

                                                <div className="lg:hidden w-full flex mt-5">
                                                    <span className="my-auto w-[135px]">
                                                        <div className={`h-8 w-24 flex my-auto rounded-xl ${Projek.status == "Progres" ? "bg-Gold" : Projek.status === "Selesai" ? "bg-Hijau-tua" : "bg-gray-300"}`}>
                                                            <p className='m-auto w-fit text-white font-semibold h-fit'>{Projek.status}</p>
                                                        </div>
                                                    </span>

                                                    <span className=" my-auto w-fit ml-auto mr-4">
                                                        <div className="text-gray-400 flex font-semibold">
                                                            {Projek.team.slice(0, 4).map((tim, index) => (
                                                                <div className="flex -mr-5" key={tim}>
                                                                    <img className='w-10 h-10 border-2 border-white rounded-[100%]' src={getTimName(tim)} alt="" />
                                                                </div>
                                                            ))}
                                                            {Projek.team.length > 4 && (
                                                                <div className="-ml-1 -mr-5 my-auto flex rounded-[100%] w-10 h-10 bg-unggu-tua text-white">
                                                                    <p className="w-fit h-fit m-auto">
                                                                        +{Projek.team.length - 4}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </span>
                                                </div>

                                                <span className="lg:block hidden ml-8 my-auto w-[135px]">
                                                    <div className={`h-8 w-24 flex my-auto rounded-xl ${Projek.status == "Progres" ? "bg-Gold" : Projek.status === "Selesai" ? "bg-Hijau-tua" : "bg-gray-300"}`}>
                                                        <p className='m-auto w-fit text-white font-semibold h-fit'>{Projek.status}</p>
                                                    </div>
                                                </span>

                                                <span className="ml-5 my-auto w-[full]">
                                                    <div className="text-gray-400 lg:block flex font-semibold">
                                                        <h1 className={`${percentages[index] === '100' ? "text-Hijau-tua" : percentages[index] < '1' ? "text-gray-300" :"text-Gold"}`}>{percentages[index] || 0}%</h1>
                                                        <div className='w-[250px] my-auto lg:my-0 ml-1 lg:ml-0 h-2 bg-gray-300 rounded-2xl'>
                                                            <div className={`h-2 rounded-2xl ${percentages[index] === '100' ? "bg-Hijau-tua" : "bg-Gold"}`} style={{ width: `${percentages[index] || 0}%` }}></div>
                                                        </div>
                                                    </div>
                                                </span>

                                            </NavLink>
                                            {userRole === 'Admin' && (
                                                <div className="w-fit absolute right-5 top-5 lg:m-auto cursor-pointer block lg:hidden" onClick={() => { handleClickID(Projek._id) }}>
                                                    <BsThreeDotsVertical size={'20px'} />
                                                </div>
                                            )}

                                            <div className='relative lg:w-[100px] lg:h-[100px] flex lg:mr-0 lg:my-auto mt-2 mr-2'>
                                                {userRole === 'Admin' && (

                                                    <div className="w-fit lg:m-auto cursor-pointer lg:block hidden" onClick={() => { handleClickID(Projek._id) }}>
                                                        <BsThreeDotsVertical size={'20px'} />
                                                    </div>
                                                )}

                                                {showEditDanApus[Projek._id] && (
                                                    <div className="absolute inset-0 p-3 items-center justify-center z-10 w-[170px] h-fit shadow-lg shadow-black/20 bg-white lg:-left-32 -left-40 rounded-xl lg:top-[50px] top-[9px] border " >
                                                        <div className="flex">
                                                            <p className='font-semibold'>Detail</p>
                                                            <div className="w-fit h-fit ml-auto text-xs cursor-pointer" onClick={() => setshowEditDanApus(false)}>
                                                                X
                                                            </div>
                                                        </div>

                                                        {Projek.status === 'Selesai' || Projek.status === 'Progres' ? (
                                                            <div className="">
                                                                <div className="flex w-full mt-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2" onClick={() => handleClickEdit(IDObjek)}>
                                                                    <span className=" my-auto">
                                                                        <BiPencil size={'20px'} />
                                                                    </span>

                                                                    <p className="ml-2 my-auto">Edit</p>
                                                                </div>

                                                                <hr className="my-3 w-[160px] -ml-2 " />

                                                                <div className="flex w-full cursor-pointer text-black hover:bg-gray-100 rounded-lg p-2" onClick={() => {
                                                                    handleDRaft(IDObjek);
                                                                }}>
                                                                    <span className=" my-auto">
                                                                        <TiDocumentText size={'20px'} />
                                                                    </span>

                                                                    <p className="ml-2 my-auto">Draft</p>
                                                                </div>
                                                            </div>

                                                        ) : (
                                                            <div className="">
                                                                <div className="flex w-full mt-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2" onClick={() => handleClickEdit(IDObjek)}>
                                                                    <span className=" my-auto">
                                                                        <BiPencil size={'20px'} />
                                                                    </span>

                                                                    <p className="ml-2 my-auto">Edit</p>
                                                                </div>


                                                                <div className="flex w-full cursor-pointer text-black hover:bg-gray-100 rounded-lg p-2" onClick={() => {
                                                                    handleUP(IDObjek);
                                                                }}>
                                                                    <span className=" my-auto">
                                                                        <GrDocumentUpdate size={'20px'} />
                                                                    </span>

                                                                    <p className="ml-2 my-auto">Submit</p>
                                                                </div>

                                                                <hr className="my-3 w-[160px] -ml-2 " />

                                                                <div className="flex w-full cursor-pointer text-red-500 hover:bg-gray-100 rounded-lg p-2" onClick={() => {
                                                                    handleDelete(IDObjek);
                                                                }}>
                                                                    <span className=" my-auto">
                                                                        <RiDeleteBin5Line size={'20px'} />
                                                                    </span>

                                                                    <p className="ml-2 my-auto">Cancel</p>
                                                                </div>
                                                            </div>


                                                        )}

                                                        <div className="w-full h-1"></div>

                                                    </div>
                                                )}
                                            </div>


                                            {/* #909 */}

                                        </div>
                                    ))
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>

                        ) : (

                            <div className="w-full h-fit">
                                {filteredDataBYID ? (
                                    filteredDataBYID.map((Projek, index) => (

                                        <div key={Projek._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                                            <NavLink to={`/Objective/${Projek._id}`} className='flex w-full h-[100px] rounded-lg'>

                                            <div className="lg:ml-5 lg:my-auto lg:w-[300px] lg:block flex w-full ">
                                                    <p className="lg:text-base text-xl font-semibold">{Projek.nama}</p>
                                                </div>

                                                <div className="lg:hidden my-auto w-[150px]">
                                                    {/* <p className="text-gray-400 font-semibold">
                                                        START QUARTER - END QUARTER
                                                    </p> */}
                                                    <p className='text-xs font-medium'>{getQuarterdate(new Date(Projek.start_date), new Date(Projek.end_date))}</p>
                                                </div>

                                                <span className="ml-5 my-auto w-[170px] lg:block  hidden">
                                                    <div className="text-gray-400 flex font-semibold">
                                                        {Projek.team.slice(0, 4).map((tim, index) => (
                                                            <div className="flex -mr-5" key={tim}>
                                                                <img className='w-10 h-10 border-2 border-white rounded-[100%]' src={getTimName(tim)} alt="" />
                                                            </div>
                                                        ))}
                                                        {Projek.team.length > 4 && (
                                                            <div className="-ml-1 my-auto flex rounded-[100%] w-10 h-10 bg-unggu-tua text-white">
                                                                <p className="w-fit h-fit m-auto">
                                                                    +{Projek.team.length - 4}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </span>

                                                <span className="ml-5 my-auto w-[125px] lg:block hidden">
                                                    {/* <p className="text-gray-400 font-semibold">
                                                        START QUARTER - END QUARTER
                                                    </p> */}
                                                    <p>{getQuarterdate(new Date(Projek.start_date), new Date(Projek.end_date))}</p>
                                                </span>

                                                <div className="lg:hidden w-full flex mt-5">
                                                    <span className="my-auto w-[135px]">
                                                        <div className={`h-8 w-24 flex my-auto rounded-xl ${Projek.status == "Progres" ? "bg-Gold" : Projek.status === "Selesai" ? "bg-Hijau-tua" : "bg-gray-300"}`}>
                                                            <p className='m-auto w-fit text-white font-semibold h-fit'>{Projek.status}</p>
                                                        </div>
                                                    </span>

                                                    <span className=" my-auto w-fit ml-auto mr-4">
                                                        <div className="text-gray-400 flex font-semibold">
                                                            {Projek.team.slice(0, 4).map((tim, index) => (
                                                                <div className="flex -mr-5" key={tim}>
                                                                    <img className='w-10 h-10 border-2 border-white rounded-[100%]' src={getTimName(tim)} alt="" />
                                                                </div>
                                                            ))}
                                                            {Projek.team.length > 4 && (
                                                                <div className="-ml-1 -mr-5 my-auto flex rounded-[100%] w-10 h-10 bg-unggu-tua text-white">
                                                                    <p className="w-fit h-fit m-auto">
                                                                        +{Projek.team.length - 4}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </span>
                                                </div>

                                                <span className="lg:block hidden ml-8 my-auto w-[135px]">
                                                    <div className={`h-8 w-24 flex my-auto rounded-xl ${Projek.status == "Progres" ? "bg-Gold" : Projek.status === "Selesai" ? "bg-Hijau-tua" : "bg-gray-300"}`}>
                                                        <p className='m-auto w-fit text-white font-semibold h-fit'>{Projek.status}</p>
                                                    </div>
                                                </span>

                                                <span className="ml-5 my-auto w-[full]">
                                                    <div className="text-gray-400 lg:block flex font-semibold">
                                                        <h1 className={`${percentages[index] === '100' ? "text-Hijau-tua" : percentages[index] < '1' ? "text-gray-300" :"text-Gold"}`}>{percentages[index] || 0}%</h1>
                                                        <div className='w-[250px] my-auto lg:my-0 ml-1 lg:ml-0 h-2 bg-gray-300 rounded-2xl'>
                                                            <div className={`h-2 rounded-2xl ${percentages[index] === '100' ? "bg-Hijau-tua" : "bg-Gold"}`} style={{ width: `${percentages[index] || 0}%` }}></div>
                                                        </div>
                                                    </div>
                                                </span>

                                            </NavLink>
                                            {/* #909 */}

                                        </div>
                                    ))
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>
                        )}


                        {/*  <div className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                            <span className="ml-5 my-auto w-[300px]">
                                <p className="text-gray-400 font-semibold">PROJEK</p>
                            </span>

                            <span className="ml-5 my-auto w-[300px]">
                                <p className="text-gray-400 font-semibold">ANGGOTA</p>
                            </span>

                            <span className="ml-5 my-auto w-[100px]">
                                <p className="text-gray-400 font-semibold">QUARTER</p>
                            </span>

                            <span className="ml-5 my-auto w-[100px]">
                                <p className="text-gray-400 font-semibold">STATUS</p>
                            </span>

                            <span className="ml-5 my-auto w-[280px]">
                                <p className="text-gray-400 font-semibold">PENYELESAIAN</p>
                            </span>
                        </div> */}


                        {showEdit && (
                            <div className="fixed inset-0 flex items-center justify-center z-10">
                                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                                <div className="modal-container bg-white w-full md:max-w-5xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                    <div className="modal-close flex z-50">
                                        <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                            <h1>Edit Projek</h1>
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
                                                <div className="flex w-full">
                                                    <div className="w-[480px] h-fit ">
                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Nama</label><br />
                                                            <input type="text" name='nama' placeholder='Nama' value={formDataEdit.nama} onChange={handleInputChangeEdit}
                                                                className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Deskripsi</label><br />
                                                            <textarea type="text" name='deskripsi' placeholder='Deskripsi' value={formDataEdit.deskripsi} onChange={handleInputChangeEdit}
                                                                className="min-h-[41px] max-h-[175px] px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className="flex w-full mb-2">
                                                            <div className='w-[230px] '>
                                                                <label htmlFor="" className='ml-2'>Start_date</label><br />
                                                                <input type="date" name='start_date' onChange={handleInputChangeEdit} value={formDataEdit.start_date}
                                                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                            </div>
                                                            <div className='w-[230px] ml-auto'>
                                                                <label htmlFor="" className='ml-2'>End_date</label><br />
                                                                <input type="date" name='end_date' onChange={handleInputChangeEdit} value={formDataEdit.end_date}
                                                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="w-[480px] h-fit ml-auto">
                                                        <h1 className='px-2'>Pilih Tim:</h1>
                                                        <input
                                                            type="text"
                                                            placeholder="Cari Tim"
                                                            value={searchKeyword}
                                                            onChange={handleCheckboxChangeEdit}
                                                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                                                        />
                                                        <div className='overflow-y-auto max-h-[160px] mt-2'>
                                                            {filteredTim.map((tim) => (
                                                                <div key={tim._id}>
                                                                    <div className={`mb-1 flex px-2 border bg-gray-100 rounded-md cursor-pointer ${selectedTim.includes(tim._id) ? 'bg-unggu-muda' : ''}`}
                                                                        onClick={() => handleClick(tim._id)} >
                                                                        {/* Tambahkan tindakan di sini */}
                                                                        <input type="checkbox" name='team' value={tim._id} checked={selectedTim.includes(tim._id)}
                                                                            onChange={handleCheckboxChangeEdit}

                                                                        />
                                                                        <div className="ml-1 my-auto">
                                                                            <img src={`http://localhost:9000/okr.profile/${tim.foto}`} className='h-8 w-8 border border-unggu rounded-full ' />
                                                                        </div>
                                                                        <div className="ml-1 my-auto">
                                                                            <p>{tim.nama}</p>
                                                                            <p>Divisi : {tim.divisi}</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Edit Projek"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </form>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        )}

                        {showTambah && (
                            <div className="fixed inset-0 flex items-center justify-center z-10">
                                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                                <div className="modal-container bg-white w-full md:max-w-5xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                    <div className="modal-close flex z-50">
                                        <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                            <h1>Tambah Projek</h1>
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
                                                <div className="flex w-full">
                                                    <div className="w-[480px] h-fit ">
                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Nama</label><br />
                                                            <input type="text" name='nama' placeholder='Nama' onChange={handleInputChange}
                                                                className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Deskripsi</label><br />
                                                            <textarea type="text" name='deskripsi' placeholder='Deskripsi' onChange={handleInputChange}
                                                                className="min-h-[41px] max-h-[175px] px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className="flex w-full mb-2">
                                                            <div className='w-[230px] '>
                                                                <label htmlFor="" className='ml-2'>Start_date</label><br />
                                                                <input type="date" name='start_date' onChange={handleInputChange}
                                                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                            </div>
                                                            <div className='w-[230px] ml-auto'>
                                                                <label htmlFor="" className='ml-2'>End_date</label><br />
                                                                <input type="date" name='end_date' onChange={handleInputChange}
                                                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="w-[480px] h-fit ml-auto">
                                                        <h1 className='px-2'>Pilih Tim:</h1>
                                                        <input
                                                            type="text"
                                                            placeholder="Cari Tim"
                                                            value={searchKeyword}
                                                            onChange={handleSearchChange}
                                                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                                                        />
                                                        <div className='overflow-y-auto max-h-[160px] mt-2'>
                                                            {filteredTim.map((tim) => (
                                                                <div key={tim._id}>
                                                                    <div className={`mb-1 flex px-2 border bg-gray-100 rounded-md cursor-pointer ${selectedTim.includes(tim._id) ? 'bg-unggu-muda' : ''}`}
                                                                        onClick={() => handleClick(tim._id)} >
                                                                        {/* Tambahkan tindakan di sini */}
                                                                        <input type="checkbox" name='team' value={tim._id} checked={selectedTim.includes(tim._id)}
                                                                            onChange={handleCheckboxChange}

                                                                        />
                                                                        <div className="ml-1 my-auto">
                                                                            <img src={`http://localhost:9000/okr.profile/${tim.foto}`} className='h-8 w-8 border border-unggu rounded-full ' />
                                                                        </div>
                                                                        <div className="ml-1 my-auto">
                                                                            <p>{tim.nama}</p>
                                                                            <p>Divisi : {tim.divisi}</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Tambah Projek"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </form>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        )}

                        {showTambah2 && (
                            <div className="fixed inset-0 flex items-center justify-center z-10">
                                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                                <div className="modal-container bg-white w-full max-w-sm mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
                                    <div className="modal-close flex z-50">
                                        <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                                            <h1>Tambah Projek</h1>
                                        </div>
                                        <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                            <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowTambah2(false)}>
                                                <p className=' w-fit h-fit text-white m-auto '>X</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-content py-4 text-left px-6">
                                        <div className="w-auto">
                                            <form action="" onSubmit={handleSubmit} className=''>
                                                <div className="w-full">
                                                    <div className="w-full h-fit ">
                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Nama</label><br />
                                                            <input type="text" name='nama' placeholder='Nama' onChange={handleInputChange}
                                                                className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className='mb-2'>
                                                            <label htmlFor="" className='ml-2'>Deskripsi</label><br />
                                                            <textarea type="text" name='deskripsi' placeholder='Deskripsi' onChange={handleInputChange}
                                                                className="min-h-[41px] max-h-[175px] px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>

                                                        <div className='w-full mb-2 '>
                                                            <label htmlFor="" className='ml-2'>Start_date</label><br />
                                                            <input type="date" name='start_date' onChange={handleInputChange}
                                                                className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>
                                                        <div className='w-full mb-2'>
                                                            <label htmlFor="" className='ml-2'>End_date</label><br />
                                                            <input type="date" name='end_date' onChange={handleInputChange}
                                                                className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                        </div>
                                                    </div>


                                                    <div className="w-full h-fit ml-auto">
                                                        <h1 className='px-2'>Pilih Tim:</h1>
                                                        <input
                                                            type="text"
                                                            placeholder="Cari Tim"
                                                            value={searchKeyword}
                                                            onChange={handleSearchChange}
                                                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                                                        />
                                                        <div className='overflow-y-auto max-h-[160px] mt-2'>
                                                            {filteredTim.map((tim) => (
                                                                <div key={tim._id}>
                                                                    <div className={`mb-1 flex px-2 border bg-gray-100 rounded-md cursor-pointer ${selectedTim.includes(tim._id) ? 'bg-unggu-muda' : ''}`}
                                                                        onClick={() => handleClick(tim._id)} >
                                                                        {/* Tambahkan tindakan di sini */}
                                                                        <input type="checkbox" name='team' value={tim._id} checked={selectedTim.includes(tim._id)}
                                                                            onChange={handleCheckboxChange}

                                                                        />
                                                                        <div className="ml-1 my-auto">
                                                                            <img src={`http://localhost:9000/okr.profile/${tim.foto}`} className='h-8 w-8 border border-unggu rounded-full ' />
                                                                        </div>
                                                                        <div className="ml-1 my-auto">
                                                                            <p>{tim.nama}</p>
                                                                            <p>Divisi : {tim.divisi}</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Tambah Projek"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

                                            </form>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        )}

                    </div>

                </div>

                <div className='h-[70px] '></div>

            </div>
        </div>
    )
}
