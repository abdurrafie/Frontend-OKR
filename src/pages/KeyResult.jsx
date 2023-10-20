import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';


import { BiArrowBack, BiSolidFolderPlus, BiPencil } from "react-icons/bi";
import { IoIosAddCircle, IoIosAddCircleOutline } from "react-icons/io";
import { BsFillPersonCheckFill, BsCheckLg, BsLink, BsLink45Deg, BsThreeDotsVertical } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { HiMiniChartBarSquare, HiDocumentText, HiOutlineDocumentText } from "react-icons/hi2";
import { AiOutlineEye, AiFillFolderAdd, AiOutlineLink } from "react-icons/ai";
import { HiOutlineViewGridAdd } from "react-icons/hi";



export const KeyResult = () => {
    const { id } = useParams();
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [successMessage, setSuccessMessage] = useState('');


    const [dataKeyResult, setdataKeyResult] = useState({}); // Menambahkan state data
    const [dataProjek, setdataProjek] = useState({}); // Menambahkan state data
    const [TotalProjek, setTotalProjek] = useState(0); // Menambahkan state data
    const [projekSelesai, setprojekSelesai] = useState(0); // Menambahkan state data
    const [projekPending, setprojekPending] = useState(0); // Menambahkan state data
    const [assign_to, setassign_to] = useState(0); // Menambahkan state data
    const [UserID, setUserID] = useState(0); // Menambahkan state data
    const [showTambah, setshowTambah] = useState(false); // Tambahkan state untuk popup pengeditan
    const [showEdit, setshowEdit] = useState(); // Tambahkan state untuk popup pengeditan
    const [image, setImage] = useState(null);
    const [currentDatetime, setCurrentDatetime] = useState('');
    const [IDProges, setIDProges] = useState(null); // Menambahkan state data


    const [formData, setFormData] = useState({
        id_keyresult: `${id}`,
        nama: '',
        deskripsi: '',
        tanggal: '',
        total: '',
        file: '',
        link: '',
    });



    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('token', token);
        // Decode the token
        // const decodedToken = jwt_decode(token);

        // // Anda dapat mengakses data dalam decodedToken sesuai dengan struktur token JWT Anda
        // console.log('Dekode Token:', decodedToken);

        // // Contoh mengakses ID pengguna dari token
        // const userId = decodedToken.id;

        // setUserID(userId)
        // console.log(userId);

        axios.get(`http://localhost:3050/profile/get`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log('data token', response.data._id);
                const Data = response.data._id;
                setUserID(Data)

            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

        const role = localStorage.getItem('role');
        setUserRole(role);

        axios.get(`http://localhost:3050/keyresult/${id}`)
            .then((response) => {
                console.log(response.data.keyresult);
                const Data = response.data.keyresult;
                const statuspro = response.data.keyresult
                // .map((objektif) => objektif.assign_to).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik

                console.log('ass', Data.assign_to);

                setassign_to(Data.assign_to);

                setdataKeyResult(Data);


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });


        axios.get(`http://localhost:3050/progres/keyresult/${id}`)
            .then((response) => {
                console.log('data', response.data.progres[0]);
                const Data = response.data.progres;

                const statuspro = response.data.progres
                    .map((objektif) => objektif.status).flat().filter((id, index, self) => self.indexOf(id) === index); // Memastikan ID unik

                const statusess = Data.map(result => result.status); // Mengekstrak status saja

                const completedStatusapprove = statusess.filter((status) => status === 'Approve').length;
                const completedStatusPending = statusess.filter((status) => status === 'Pending').length;


                console.log(completedStatusapprove);

                setprojekPending(completedStatusPending);
                setprojekSelesai(completedStatusapprove);
                setTotalProjek(Data.length);
                setdataProjek(Data);


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [id]);

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentDatetimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
        setCurrentDatetime(currentDatetimeValue);
    }, []);

    const calculatePercentage = () => {
        if (dataKeyResult.target_value > 0) {
            return ((dataKeyResult.current_value / dataKeyResult.target_value) * 100).toFixed(0);
        }
        return 0;
    };

    const getBarColorBG = (percentage) => {
        if (parseFloat(percentage) >= 100) {
            return 'bg-Hijau-tua'; // Warna hijau jika persentase mencapai atau melebihi 100%
        }
        return 'bg-Gold'; // Gantilah dengan warna yang Anda inginkan untuk persentase yang kurang dari 100%
    };
    const getBarColor = (percentage) => {
        if (parseFloat(percentage) >= 100) {
            return 'text-Hijau-tua'; // Warna hijau jika persentase mencapai atau melebihi 100%
        }
        return 'text-Gold'; // Gantilah dengan warna yang Anda inginkan untuk persentase yang kurang dari 100%
    };

    // Langkah 1: Buat fungsi untuk mengonversi tanggal
    function convertDateFormat(inputDate) {
        if (typeof inputDate !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(inputDate)) {
            // Pastikan inputDate adalah string dengan format "YYYY-MM-DDTHH:MM"
            return null;
        }

        // Bagi tanggal dan waktu menjadi komponen
        const dateTimeComponents = inputDate.split('T');
        const dateComponents = dateTimeComponents[0].split('-');
        const timeComponents = dateTimeComponents[1].split(':');

        // Periksa apakah pembagian menghasilkan tiga komponen
        if (dateComponents.length !== 3 || timeComponents.length !== 2) {
            return null;
        }

        // Dapatkan tahun, bulan, hari, jam, dan menit
        const year = dateComponents[0];
        const month = dateComponents[1];
        const day = dateComponents[2];
        const hour = timeComponents[0];
        const minute = timeComponents[1];

        // Buat string tanggal dan waktu yang diformat "DD/MM/YYYY HH:MM"
        const formattedDatetime = `${hour}:${minute} - ${day}/${month}/${year}`;
        return formattedDatetime;
    }




    // const tanggalYangBenar = dataProjek.length > 0 ? convertDateFormat(dataProjek[0].tanggal) : null;

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

            if (selectedFileEdit) {
                const objectUrl = URL.createObjectURL(selectedFileEdit);

                setFormData({
                    ...formData,
                    file: selectedFileEdit,
                });

                setImage(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormData({
                    ...formData,
                    file: null, // Atur nilai null saat tidak ada file yang dipilih
                });
                setImage(null); // Menampilkan pratinjau file yang dipilih

            }
            // } else if (name === 'id_objek') {
            //     setFormData({
            //         ...formData,
            //         id_objek: IDObjek,
            //     });
        } else {
            setFormData({
                ...formData,
                [name]: value,
                tanggal: currentDatetime,
                // id_objek: IDObjek,
            });
        }
    };

    console.log('data ta ta', formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            // Hitung nilai total (current_value + total)
            const totalValue = Number(dataKeyResult.current_value) + Number(formData.total);
            console.log('totalValue', totalValue);

            if (totalValue > dataKeyResult.target_value) {
                // Jika total lebih besar dari target, tampilkan pesan kesalahan
                Swal.fire({
                    title: 'Error',
                    text: 'Gagal menambah Progres: Nilai Total melebihi Target Value',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                // Jika tidak, lanjutkan dengan pengiriman permintaan POST
                const response = await axios.post('http://localhost:3050/progres', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200 || response.status === 201) {
                    const responseData = response.data.newObjekti;
                    console.log('Respon dari server (berhasil):', responseData);

                    Swal.fire({
                        title: 'Sukses',
                        text: 'Pendaftaran berhasil!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = `/KeyResult/${id}`;
                        }
                    });

                    setSuccessMessage('Pendaftaran berhasil!');
                } else {
                    console.error('Pendaftaran gagal');
                    Swal.fire('Error', 'Pendaftaran gagal', 'error');
                }
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
        }
    };


    const handleClick = (id) => {
        setIDProges(id);
    }

    console.log('ID :', IDProges);

    const [formDataEdit, setFormDataEdit] = useState({
        nama: '',
        deskripsi: '',
        file: '',
        link: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:3050/progres/getdata/${IDProges}`)
            .then((response) => {
                console.log('Data BY ID', response.data.progres);
                const Data = response.data.progres;
                    setFormDataEdit({
                        nama: Data.nama,
                        deskripsi: Data.deskripsi,
                        link: Data.link,
                    });


            })
            .catch((error) => {
                console.error('Terjadi kesalahan:', error);
            });

    }, [IDProges]);

    const handleInputChangeEdit = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

            if (selectedFileEdit) {
                const objectUrl = URL.createObjectURL(selectedFileEdit);

                setFormDataEdit({
                    ...formDataEdit,
                    file: selectedFileEdit,
                });

                setImage(objectUrl); // Menampilkan pratinjau file yang dipilih
            } else {
                setFormDataEdit({
                    ...formDataEdit,
                    file: null, // Atur nilai null saat tidak ada file yang dipilih
                });
                setImage(null); // Menampilkan pratinjau file yang dipilih

            }
            // } else if (name === 'id_objek') {
            //     setFormDataEdit({
            //         ...formDataEdit,
            //         id_objek: IDObjek,
            //     });
        } else {
            setFormDataEdit({
                ...formDataEdit,
                [name]: value,
                // id_objek: IDObjek,
            });
        }
    };

    console.log('formDataEdit', formDataEdit);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token tidak ditemukan');
                return;
            }

            // Jika tidak, lanjutkan dengan pengiriman permintaan POST
            const response = await axios.put(`http://localhost:3050/progres/${IDProges}`, formDataEdit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                const responseData = response.data.newObjekti;
                console.log('Respon dari server (berhasil):', responseData);

                Swal.fire({
                    title: 'Sukses',
                    text: 'Pendaftaran berhasil!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = `/KeyResult/${id}`;
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



    return (
        <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

            <div className="w-[260px]"></div>

            <div className="w-[1260px]">
                <div className='h-[70px]'></div>

                <div className="w-[1200px] mx-auto mt-5">
                    <NavLink to={`/Objective/${dataKeyResult.id_projek}`} className={'font-semibold text-gray-600 flex mt-[30px]'}>
                        <span className="w-fit h-fit my-auto mr-5">
                            <BiArrowBack size={'20px'} />
                        </span>

                        Kembali
                    </NavLink>

                    <div className="w-full ">
                        <div className="w-full bg-white rounded-lg p-5 mt-[30px]">
                            {dataKeyResult ? (
                                <div>
                                    <div className="w-full flex h-fit">
                                        <h1 className="font-bold text-2xl ">Key Result</h1>
                                        <h1 className='font-medium text-lg w-fit h-fit my-auto ml-auto'> To : {dataKeyResult.nama_profile}</h1>
                                    </div>

                                    <div className="flex w-full h-fit mt-3">
                                        <div className="w-[570px] h-fit ">
                                            <p className="">{dataKeyResult.nama}</p>
                                            <p className={`font-semibold text-2xl mt-7 ${getBarColor(calculatePercentage())}`}>{calculatePercentage()}%</p>

                                            <div className="h-2 w-full bg-gray-200/80 rounded-xl">
                                                <div className={`${getBarColorBG(calculatePercentage())} h-2 rounded-xl`} style={{ width: `${calculatePercentage()}%` }}></div>
                                            </div>
                                        </div>
                                        

                                        <div className="w-[570px] flex h-fit ml-auto my-auto">
                                            <div className="w-[176px] h-[176px] bg-Merah-muda rounded-xl">
                                                <div className="w-10 h-10 rounded-full bg-Merah ml-3 mt-3 flex">
                                                    <div className="text-white m-auto w-fit h-fit"><HiMiniChartBarSquare size={'30px'} /></div>
                                                </div>
                                                <h1 className="text-2xl font-semibold ml-4 mt-5">{projekPending}</h1>
                                                <h1 className="text-sm ml-4 mt-4 text-gray-600 font-medium">Pending</h1>
                                            </div>

                                            <div className="w-[176px] h-[176px] bg-cream rounded-xl mx-auto">
                                                <div className="w-10 h-10 rounded-full bg-cream-Dark ml-3 mt-3 flex">
                                                    <div className="text-white m-auto w-fit h-fit"><HiDocumentText size={'30px'} /></div>
                                                </div>
                                                <h1 className="text-2xl font-semibold ml-4 mt-5">{TotalProjek}</h1>
                                                <h1 className="text-sm ml-4 mt-4 text-gray-600 font-medium">Progress</h1>
                                            </div>

                                            <div className="w-[176px] h-[176px] bg-Hijau-muda rounded-xl">
                                                <div className="w-10 h-10 rounded-full bg-Hijau-tua ml-3 mt-3 flex">
                                                    <div className="text-white m-auto w-fit h-fit"><BsCheckLg size={'30px'} /></div>
                                                </div>
                                                <h1 className="text-2xl font-semibold ml-4 mt-5">{projekSelesai}</h1>
                                                <h1 className="text-sm ml-4 mt-4 text-gray-600 font-medium">Completed</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h1>{dataKeyResult.target_value} / {dataKeyResult.days}</h1>
                                        <p>Perhari harus mengerjakan {parseInt(dataKeyResult.target_value) / parseInt(dataKeyResult.days)}</p>
                                    </div>

                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>

                        <div className="my-[30px] flex">
                            <h1 className="font-bold w-fit h-fit my-auto">Data Progress</h1>

                            {UserID === assign_to && (
                                <div className="bg-unggu w-[180px] p-1 rounded-xl ml-auto h-10 flex cursor-pointer" onClick={() => setshowTambah(true)} >
                                    <div className="w-fit h-fit flex m-auto">
                                        <div className="text-white w-fit h-fit my-auto">
                                            <IoIosAddCircle size={'30px'} />
                                        </div>
                                        <p className='text-white w-fit h-fit my-auto font-semibold ml-2'>Add Progres</p>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="w-full mt-[30px]">
                            {Array.isArray(dataProjek) ? (
                                dataProjek.map((data) => (
                                    <div key={data._id} className="bg-white rounded-lg p-5 mt-5">
                                        <div className="flex">
                                            <h1 className="text-unggu font-semibold">{data.nama}</h1>
                                            <div className="flex ml-auto">
                                                <h1 className="">{data.nama_profile}</h1>
                                                <img src={`http://localhost:9000/okr.profile/${data.foto_profile}`}
                                                    className='w-5 h-5 my-auto ml-2 rounded-full' />
                                            </div>
                                        </div>

                                        <h1 className="my-5 w-[456px] ">{data.deskripsi}</h1>

                                        <div className="flex w-full">
                                            <div className="flex">
                                                <a href={`http://localhost:9000/okr.progres/${data.file}`} target="_blank">
                                                    <div className="h-10 w-36 flex p-2 bg-unggu rounded-xl text-white">
                                                        <div className="w-fit h-fit m-auto flex">
                                                            <span className="h-fit w-fit my-auto mr-2"><BiSolidFolderPlus size={'23px'} /></span>
                                                            <p className='w-fit h-fit my-auto font-medium'>File</p>
                                                        </div>
                                                    </div>
                                                </a>

                                                <a href={`https://${data.link}`} target="_blank">
                                                    <div className="h-10 w-36 flex p-2 ml-3 bg-white border border-unggu rounded-xl text-unggu">
                                                        <div className="w-fit h-fit m-auto flex">
                                                            <span className="h-fit w-fit my-auto mr-2 text-white bg-unggu rounded-lg"><BsLink size={'23px'} /></span>
                                                            <p className='w-fit h-fit my-auto font-medium'>Open link</p>
                                                        </div>
                                                    </div>
                                                </a>

                                                <div className={`h-10 w-36 flex p-2 ml-3 border rounded-xl ${data.status === 'Approve' ? "border-blue-400 text-blue-400" : "border-red-400 text-red-400"}`}>
                                                    <p className={`w-fit h-fit m-auto font-medium`}>{data.status}</p>
                                                </div>
                                                {UserID === assign_to && (

                                                    <span className='h-10 w-10 flex p-2 ml-3 border rounded-xl my-auto border-black cursor-pointer hover:bg-black hover:text-white transition-all duration-500'
                                                        onClick={() => {
                                                            handleClick(data._id);
                                                            setshowEdit({ [data._id]: true });
                                                        }}>
                                                        <BiPencil size={'20px'} className='w-fit h-fit m-auto' />
                                                    </span>
                                                )}


                                            </div>

                                            <div className="w-[170px] h-10 flex ml-auto">
                                                <p className='my-auto font-semibold text-3xl'>{data.total}</p>
                                                <div className="my-auto ml-auto h-fit w-fit">
                                                    <p className='text-sm w-fit ml-auto'>Tanggal upload</p>
                                                    <p className='text-sm w-fit h-fit mx-auto font-semibold'>{convertDateFormat(data.tanggal)}</p>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>




                    {showEdit && (
                        <div className="fixed inset-0 flex items-center justify-center z-10">
                            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-[300px] h-14 my-auto ml-5 flex'>
                                        <div className="flex w-10 h-10 my-auto bg-gray-100 rounded-full">
                                            <span className="w-fit h-fit m-auto"><HiOutlineViewGridAdd size={'25px'} /></span>
                                        </div>

                                        <div className="w-fit h-fit my-auto ml-2">
                                            <h1 className="font-semibold text-lg ">Edit Progres</h1>
                                            <p className="text-xs">Key Result : {dataKeyResult.nama}</p>
                                        </div>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowEdit(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">

                                        {/* <div>{IDObjek}</div> */}

                                        <form action="" onSubmit={handleSubmitEdit} className='' encType="multipart/form-data">
                                            <div className=" w-full">

                                                <div className='mb-2'>
                                                    <input type="text" name='nama' placeholder='Nama' value={formDataEdit.nama} onChange={handleInputChangeEdit}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <textarea type="text" name='deskripsi' placeholder='Deskripsi' value={formDataEdit.deskripsi} onChange={handleInputChangeEdit}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] min-h-[45px] max-h-[180px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleInputChangeEdit}
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
                                                        <input type="text" name='link' placeholder='Add Link' value={formDataEdit.link} onChange={handleInputChangeEdit}
                                                            className="px-2 py-3 ml-3  bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Edit Progres"
                                                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                                </div>

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
                            <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                                <div className="modal-close flex z-50">
                                    <div className='w-[300px] h-14 my-auto ml-5 flex'>
                                        <div className="flex w-10 h-10 my-auto bg-gray-100 rounded-full">
                                            <span className="w-fit h-fit m-auto"><HiOutlineViewGridAdd size={'25px'} /></span>
                                        </div>

                                        <div className="w-fit h-fit my-auto ml-2">
                                            <h1 className="font-semibold text-lg ">Tambah Progres</h1>
                                            <p className="text-xs">Key Result : {dataKeyResult.nama}</p>
                                        </div>
                                    </div>
                                    <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                                        <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowTambah(false)}>
                                            <p className=' w-fit h-fit text-white m-auto '>X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="w-auto">

                                        {/* <div>{IDObjek}</div> */}

                                        <form action="" onSubmit={handleSubmit} className='' encType="multipart/form-data">
                                            <div className=" w-full">

                                                <div className='mb-2'>
                                                    <input type="text" name='nama' placeholder='Nama' onChange={handleInputChange}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <textarea type="text" name='deskripsi' placeholder='Deskripsi' onChange={handleInputChange}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] min-h-[45px] max-h-[180px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="text" name='total' placeholder='Total' onChange={handleInputChange}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="datetime-local" name='tanggal' value={currentDatetime} disabled onChange={handleInputChange}
                                                        className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                </div>

                                                <div className='mb-2'>
                                                    <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleInputChange}
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
                                                        <input type="text" name='link' placeholder='Add Link' onChange={handleInputChange}
                                                            className="px-2 py-3 ml-3  bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                                    </div>
                                                </div>

                                                <div className='w-full mx-auto mt-10'>
                                                    <input type="submit" value="Tambah Progres"
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

                <div className='h-[10px] mt-10'></div>

            </div>
        </div>
    )
}
