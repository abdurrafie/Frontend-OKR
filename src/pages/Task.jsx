import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

import { IoIosAddCircle } from "react-icons/io";
import { GoPasskeyFill } from "react-icons/go";
import { HiOutlineKey, HiOutlineMenuAlt2 } from "react-icons/hi";
import { ImLink } from "react-icons/im";
import { MdAttachment } from "react-icons/md";
import { AiFillFile, AiFillCaretRight, AiFillCheckCircle, AiOutlineLink } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxOpenInNewWindow } from "react-icons/rx";


export const Task = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [dataTask, setdataTask] = useState(null); // Menambahkan state data
  const [dataTaskBYIDProfile, setdataTaskBYIDProfile] = useState(null); // Menambahkan state data
  const [dataTaskBYID, setdataTaskBYID] = useState(null); // Menambahkan state data
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [showTambah, setshowTambah] = useState(false); // Tambahkan state untuk popup pengeditan
  const [Alldatatim, setAlldatatim] = useState([]); // Menambahkan state data
  const [currentDatetime, setCurrentDatetime] = useState('');
  const [currentTIme, setCurrentTIme] = useState('');
  const [image, setImage] = useState(null);
  const [imageProgrestask, setImageProgrestask] = useState([]);
  const [imageSebelum, setImageSebelum] = useState([]);
  const [INPUTimageProgrestask, setINPUTImageProgrestask] = useState([]);
  const [showEditDanApus, setshowEditDanApus] = useState({}); // Tambahkan state untuk popup pengeditan
  const [IDObjek, setIDObjek] = useState(null); // Menambahkan state data
  const [IDTAKS, setIDTAKS] = useState(null); // Menambahkan state data
  const [showEdit, setshowEdit] = useState(false); // Tambahkan state untuk popup pengeditan
  const [showEditprogrestask, setshowEditprogrestask] = useState(false); // Tambahkan state untuk popup pengeditan
  const [showVIEWprogrestask, setshowVIEWprogrestask] = useState(false); // Tambahkan state untuk popup pengeditan
  const [showTambahprogrestask, setshowTambahprogrestask] = useState(false); // Tambahkan state untuk popup pengeditan
  const [selectedStatus, setSelectedStatus] = useState(''); // State untuk menyimpan status yang dipilih
  const [filteredProjek, setFilteredProjek] = useState([]);
  const [IDProfile, setIDProfile] = useState(null); // Menambahkan state data
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    file: '',
    link: '',
    assign_to: '',
    start_date: '',
    end_date: '',
  });



  useEffect(() => {

    // Pastikan peran pengguna telah diambil dari local storage
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Cek apakah token tersimpan di Local Storage
    const token = localStorage.getItem('token');
    if (token) {
      // todo console.log('Token ditemukan:', token);

      axios.get(`http://localhost:3050/task`)
        .then((response) => {
          console.log('Data Task', response.data.taskData);
          const Data = response.data.taskData;
          setdataTask(Data);

        })
        .catch((error) => {
          console.error('Terjadi kesalahan:', error);
        });

      axios.get('http://localhost:3050/profile/all')
        .then((response) => {
          // Mengisi opsi kategori dengan data dari server
          // console.log(response.data.profileData);
          setAlldatatim(response.data.profileData);
          setFilteredTim(response.data.profileData);
        })
        .catch((error) => {
          console.error('Terjadi kesalahan:', error);
        });
    } else {
      console.log('Token tidak ditemukan');
    }

  }, []);

  const [DAtatDivisi, setDAtatDivisi] = useState(null); // Menambahkan state data



  useEffect(() => {
    axios.get(`http://localhost:3050/divisi/`)
      .then((response) => {
        console.log('Data DIvisi ', response.data.divisiData);
        setDAtatDivisi(response.data.divisiData)


      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [])

  useEffect(() => {
    const currentDatetimeValue = getTimeDate()
    // const currentDateti = `${year}-${month}-${day}`;
    setCurrentDatetime(currentDatetimeValue);
    // setCurrentTIme(currentDateti);
  }, []);

  function getTimeDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentDatetimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;

    return currentDatetimeValue
  }

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

  function calculateProjectDurationInHours(startDate) {
    const now = new Date();
    const startDateObj = new Date(startDate);

    // Hitung selisih waktu dalam milidetik
    const timeDiff = now - startDateObj;

    // Hitung jumlah jam
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));

    return hours;
  }

  function calculateTimeRemaining(endDate) {
    const now = new Date();
    const endDateObj = new Date(endDate);

    // Hitung selisih waktu dalam milidetik
    const timeDiff = endDateObj - now;

    // Hitung jumlah hari dan jam
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));


    return { days, hours, minutes };
  }


  const [searchNama, setSearchNama] = useState('');
  const [searchDivisi, setSearchDivisi] = useState('');
  const [filteredTim, setFilteredTim] = useState([]);

  const handleNamaChange = (event) => {
    setSearchNama(event.target.value);
    filterTimData(event.target.value, searchDivisi);
  };

  const handleDivisiChange = (event) => {
    setSearchDivisi(event.target.value);
    filterTimData(searchNama, event.target.value);
  };



  const filterTimData = (nama, divisi) => {
    const filteredData = Alldatatim.filter((tim) => {
      if (divisi === '' || divisi === '') {
        return tim.nama.toLowerCase().includes(nama.toLowerCase());
      } else {
        return tim.nama.toLowerCase().includes(nama.toLowerCase()) && tim.divisi.toLowerCase().includes(divisi.toLowerCase());
      }
    });

    setFilteredTim(filteredData);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

      if (selectedFileEdit) {
        console.log('objectUrl', selectedFileEdit.name);

        setFormData({
          ...formData,
          file: selectedFileEdit,
        });

        setImage(selectedFileEdit.name); // Menampilkan pratinjau file yang dipilih
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
        start_date: currentDatetime,
      });
    }
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }

      const response = await axios.post('http://localhost:3050/task', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        console.log('Respon dari server (berhasil):', responseData);

        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil menambahkan Task!',
          icon: 'success',
          confirmButtonText: 'OKE',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/Task';
          }
        });

        setSuccessMessage('Berhasil menambahkan Task!');
      } else {
        console.error('Pendaftaran gagal');

        Swal.fire('Error', 'Pendaftaran gagal', 'error');
      }
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

  const handleClickEditprogrestask = (id) => {
    setIDObjek(id);
    setshowEditprogrestask(true);
  }
  const handleClickVIEWprogrestask = (id) => {
    setIDObjek(id);
    setshowVIEWprogrestask(true);
  }

  const handleClickTambahprogrestask = (id) => {
    setIDObjek(id);
    setshowTambahprogrestask(true);
  }

  const handleClickEdit = (id) => {
    setshowEdit(true);
  }

  const [formDataEdit, setFormDataEdit] = useState({
    nama: '',
    deskripsi: '',
    file: '',
    link: '',
    assign_to: '',
    nama_profile: '',
    start_date: '',
    end_date: '',
  });

  const [IDTask, setIDTask] = useState([]);


  const [formDataEditprogrestask, setFormDataEditprogrestask] = useState({
    id_task: '',
    note: '',
    tanggal: '',
    link: '',
    files: [],
  });

  useEffect(() => {
    axios.get(`http://localhost:3050/task/${IDObjek}`)
      .then((response) => {
        console.log('Data BY ID responseresponse', response.data.task);
        const Data = response.data.task;
        console.log('DATA', Data);
        setdataTaskBYID(Data);

        setFormDataEdit({
          nama: Data.nama,
          deskripsi: Data.deskripsi,
          file: Data.file,
          link: Data.link,
          assign_to: Data.assign_to,
          nama_profile: Data.nama_profile,
          start_date: Data.start_date,
          end_date: Data.end_date,
        });

        setFormDataProgrestask({
          ...formDataProgrestask,
          id_task: Data._id,
          tanggal: getTimeDate(),
        });

        // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDObjek]);

  useEffect(() => {
    axios.get(`http://localhost:3050/progrestask/task/${IDObjek}`)
      .then((response) => {
        console.log('progrestask', response.data.progresTask[0]);
        const Data = response.data.progresTask[0];
        console.log('DATA formDataEditprogrestask', Data);

        setFormDataEditprogrestask({
          id_task: Data.id_task,
          note: Data.note,
          tanggal: Data.tanggal,
          link: Data.link,
          files: Data.files,
        });
        // setImageProgrestask(Data.files);
        setImageSebelum(Data.files);
        setIDTask(Data._id);



        // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDObjek]);

  // #ffff

  const removeFileEdit = (index) => {
    const updatedFiles = [...formDataEditprogrestask.files];
    updatedFiles.splice(index, 1);
    const updatedImagePreviews = [...imageProgrestask];
    updatedImagePreviews.splice(index, 1);

    setFormDataEditprogrestask({
      ...formDataEditprogrestask,
      files: updatedFiles,
    });

    setImageProgrestask(updatedImagePreviews);
  };

  const handleEDITChangeProgrestask = (e) => {
    const { name, value, type } = e.target;

    // ...
    if (type === 'file') {
      // Dapatkan file-file lama
      const oldFiles = formDataEditprogrestask.files || [];

      // Ambil file-file yang baru diunggah
      const selectedFileEdit = Array.from(e.target.files);

      // Ambil nama file-file baru
      const objectUrls = selectedFileEdit.map((file) => file.name);

      // Gabungkan file-file lama dengan file-file baru
      const updatedFiles = [...oldFiles, ...selectedFileEdit];

      if (selectedFileEdit) {
        const updatedImagePreviews = [...imageProgrestask, ...objectUrls];
        console.log('ASOSPAOSPOAPS', objectUrls);

        setFormDataEditprogrestask({
          ...formDataEditprogrestask,
          files: updatedFiles,
        });

        setImageProgrestask(updatedImagePreviews); // Menampilkan pratinjau nama file yang dipilih
        setImageSebelum(null); // Menampilkan pratinjau nama file yang dipilih
      } else {
        setFormDataEditprogrestask({
          ...formDataEditprogrestask,
          files: updatedFiles, // Atur nilai oldFiles saat tidak ada file yang dipilih
        });
        setImageProgrestask(oldFiles); // Menghapus pratinjau nama file
      }
    }
    // ...
    else if (name === 'removeFile') {
      removeFileEdit(Number(value)); // Remove the file at the specified index
    } else {
      setFormDataEditprogrestask({
        ...formDataEditprogrestask,
        [name]: value,
      });
    }
  };


  console.log('formDataEditprogrestask', formDataEditprogrestask);

  const handleInputChangeEdit = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama

      if (selectedFileEdit) {
        console.log('objectUrl', selectedFileEdit.name);

        setFormDataEdit({
          ...formDataEdit,
          file: selectedFileEdit,
        });

        setImage(selectedFileEdit.name); // Menampilkan pratinjau file yang dipilih
      } else {
        setFormDataEdit({
          ...formDataEdit,
          file: null, // Atur nilai null saat tidak ada file yang dipilih
        });
        setImage(null); // Menampilkan pratinjau file yang dipilih

      }
      // } else if (name === 'id_objek') {
      //     setFormDataEdit({
      //         ...formData,
      //         id_objek: IDObjek,
      //     });
    } else {
      setFormDataEdit({
        ...formDataEdit,
        [name]: value,
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

      const response = await axios.put(`http://localhost:3050/task/${IDObjek}`, formDataEdit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        console.log('Respon dari server (berhasil):', responseData);

        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil Mengedit Task!',
          icon: 'success',
          confirmButtonText: 'OKE',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/Task';
          }
        });

        setSuccessMessage('erhasil Mengedit Task!');
      } else {
        console.error('Pendaftaran gagal');

        Swal.fire('Error', 'Pendaftaran gagal', 'error');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);

      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };

  const filteredData = dataTask ? dataTask.filter((task) => {
    if (selectedStatus === '') {
      return true; // Tampilkan semua tugas jika tidak ada status yang dipilih.
    }
    return task.status === selectedStatus;
  }) : [];

  const filteredDataBYID = dataTaskBYIDProfile ? dataTaskBYIDProfile.filter((task) => {
    if (selectedStatus === '') {
      return true; // Tampilkan semua tugas jika tidak ada status yang dipilih.
    }
    return task.status === selectedStatus;
  }) : [];

  console.log('IDObjek', IDObjek);

  const [formDataProgrestask, setFormDataProgrestask] = useState({
    id_task: '',
    note: '',
    tanggal: '',
    files: [],
    link: '',
  });

  // Function to remove a file
  const removeFile = (index) => {
    const updatedFiles = [...formDataProgrestask.files];
    updatedFiles.splice(index, 1);
    const updatedImagePreviews = [...INPUTimageProgrestask];
    updatedImagePreviews.splice(index, 1);

    setFormDataProgrestask({
      ...formDataProgrestask,
      files: updatedFiles,
    });

    setINPUTImageProgrestask(updatedImagePreviews);
  };

  const handleInputChangeProgrestask = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      // const selectedFileEdit = e.target.files[0]; // Mengambil file yang dipilih, hanya yang pertama
      const selectedFileEdit = Array.from(e.target.files);

      if (selectedFileEdit) {
        // Combine the new files with existing ones
        const updatedFiles = [...formDataProgrestask.files, ...selectedFileEdit];
        const objectUrls = selectedFileEdit.map((files) => files.name);
        const updatedImagePreviews = [...INPUTimageProgrestask, ...objectUrls];
        console.log('ASOSPAOSPOAPS', objectUrls);

        setFormDataProgrestask({
          ...formDataProgrestask,
          files: updatedFiles,
        });

        setINPUTImageProgrestask(updatedImagePreviews); // Menampilkan pratinjau file yang dipilih
      } else {
        const updatedFiles = [...formDataProgrestask.files, ...selectedFileEdit];
        const objectUrls = selectedFileEdit.map((files) => files.name);
        const updatedImagePreviews = [...INPUTimageProgrestask, ...objectUrls];

        setFormDataProgrestask({
          ...formDataProgrestask,
          files: updatedFiles, // Atur nilai null saat tida k ada file yang dipilih
        });
        setINPUTImageProgrestask(INPUTimageProgrestask); // Menampilkan pratinjau file yang dipilih


      }
    } else if (name === 'removeFile') {
      removeFile(Number(value)); // Remove the file at the specified index
    } else {
      setFormDataProgrestask({
        ...formDataProgrestask,
        [name]: value,
      });
    }
  };

  console.log('formDataProgrestask', formDataProgrestask);


  const handleSubmitProgrestask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }

      const formDataToSubmit = new FormData();
      for (const key in formDataProgrestask) {
        if (key === 'files') {
          for (let i = 0; i < formDataProgrestask.files.length; i++) {
            formDataToSubmit.append('files', formDataProgrestask.files[i]);
          }
        } else {
          formDataToSubmit.append(key, formDataProgrestask[key]);
        }
      }

      const response = await axios.post('http://localhost:3050/progrestask', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formDataToSubmit),

      });

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        console.log('Respon dari server (berhasil):', responseData);

        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil menambahkan Progres Task!',
          icon: 'success',
          confirmButtonText: 'OKE',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/Task';
          }
        });

        setSuccessMessage('Berhasil menambahkan Progres Task!');
      } else {
        console.error('Pendaftaran gagal');

        Swal.fire('Error', 'Pendaftaran gagal', 'error');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);

      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };


  // #ffff

  const handleSubmitEditProgrestask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }

      const formDataToSubmit = new FormData();
      for (const key in formDataEditprogrestask) {
        if (key === 'files') {
          for (let i = 0; i < formDataEditprogrestask.files.length; i++) {
            formDataToSubmit.append('files', formDataEditprogrestask.files[i]);
          }
        } else {
          formDataToSubmit.append(key, formDataEditprogrestask[key]);
        }
      }

      const response = await axios.put(`http://localhost:3050/progrestask/${IDTask}`, formDataToSubmit, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify(formDataToSubmit),

      });

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        console.log('Respon dari server (berhasil):', responseData);

        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil Mengedit Progres task!',
          icon: 'success',
          confirmButtonText: 'OKE',
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = '/Task';
          }
        });

        setSuccessMessage('Berhasil Mengedit Progres task!');
      } else {
        console.error('Pendaftaran gagal');

        Swal.fire('Error', 'Pendaftaran gagal', 'error');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);

      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };


  // #FF0000


  // Gunakan useEffect untuk mengambil data saat komponen pertama kali di-render
  useEffect(() => {
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
          setIDProfile(data._id);
        })
        .catch(error => {
          console.error('Terjadi kesalahan:', error);
        });
    } else {
      console.log('Token tidak ditemukan');
    }
  }, []); // Parameter kedua [] memastikan bahwa useEffect hanya dijalankan sekali saat komponen pertama kali di-render

  console.log('IDProfile TASK', IDProfile);

  useEffect(() => {
    axios.get(`http://localhost:3050/task/profile/${IDProfile}`)
      .then((response) => {
        console.log('Data BY ID TETETETAY', response.data);
        const Data = response.data.tasks;
        console.log('DATA', Data);
        setdataTaskBYIDProfile(Data)

        // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDProfile]);



  // useEffect(() => {
  // axios.get(`http://localhost:3050/progrestask/${IDObjek}`)
  //   .then((response) => {
  //     console.log('progrestask', response.data);
  //     // const Data = response.data.task;
  //     // console.log('DATA', Data);
  //     // setdataTaskBYID(Data);

  //     // setFormDataEditprogrestask({
  //     //   nama: Data.nama,
  //     //   deskripsi: Data.deskripsi,
  //     //   file: Data.file,
  //     //   link: Data.link,
  //     //   assign_to: Data.assign_to,
  //     //   nama_profile: Data.nama_profile,
  //     //   start_date: Data.start_date,
  //     //   end_date: Data.end_date,
  //     // });



  //     // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
  //   })
  //   .catch((error) => {
  //     console.error('Terjadi kesalahan:', error);
  //   });

  // }, [IDObjek]);

  console.log('DATA BY ID', dataTaskBYID);

  // #909


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
          axios.delete(`http://localhost:3050/task/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data', // Set header Content-Type
            },
          })
            .then(() => {
              // Perbarui tampilan komponen dengan menghapus item dari state dataGallery
              window.location.href = `/Task`;

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


  return (
    <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

      <div className="w-[260px]"></div>

      <div className="w-[1260px]">
        <div className='h-[70px]'></div>

        <div className="w-[1200px] mx-auto mt-5">
          <div className="flex">
            <select name="" onChange={(e) => setSelectedStatus(e.target.value)}
              className='w-[200px] h-10 p-1 shadow-lg rounded-lg'>
              <option value="">Semua status</option>
              <option value="Selesai">Selesai</option>
              <option value="Pending">Pending</option>
              <option value="Belum Selesai">Belum Selesai</option>
            </select>

            {userRole === 'Admin' && (
              <div className="bg-unggu w-[180px] p-1 rounded-xl ml-auto h-10 flex cursor-pointer" onClick={() => setshowTambah(true)}>
                <div className="w-fit h-fit flex m-auto">
                  <div className="text-white w-fit h-fit my-auto" >
                    <IoIosAddCircle size={'30px'} />
                  </div>
                  <p className='text-white w-fit h-fit my-auto font-semibold ml-2'>Tambah Task</p>
                </div>
              </div>
            )}
            {/* Hanya tampilkan elemen jika peran pengguna adalah "admin" */}

          </div>

          <div className="w-full mt-10">
            <div className='flex w-full h-[60px] bg-white shadow rounded-lg'>
              <span className="ml-5 my-auto w-[300px]">
                <p className="text-gray-400 font-semibold">NAMA</p>
              </span>

              <span className="ml-5 flex my-auto w-[86px]">
                <p className="text-gray-400 font-semibold">ASSIGN TO</p>
              </span>

              <span className="ml-5 flex my-auto w-[220px]">
                <p className="text-gray-400 mx-auto font-semibold">Start DATE - END DATE</p>
              </span>

              <span className="ml-8 flex my-auto w-[150px]">
                <p className="text-gray-400 mx-auto font-semibold">DOCUMENT</p>
              </span>

              <span className="ml-5 flex my-auto w-[150px]">
                <p className="text-gray-400 mx-auto font-semibold">STATUS</p>
              </span>
            </div>

            {userRole === 'Admin' || userRole === 'Menejemen' ? (
              <div className="">
                {filteredData ? (
                  filteredData.map((task, index) => (
                    <div key={task._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                      <span className="ml-5 my-auto w-[300px]">
                        <p className=" font-semibold w-[300px]">{task.nama}</p>
                      </span>

                      <div className="ml-5 my-auto flex w-[86px]">
                        <span className='w-fit mx-auto flex'>
                          <img src={`http://localhost:9000/okr.profile/${task.foto_profile}`}
                            className='w-10 h-10 border-2 border-white rounded-[100%]' />
                        </span>
                      </div>


                      <span className="ml-5 my-auto w-[220px]">
                        <div className="text-gray-400 flex font-medium w-fit mx-auto">
                          <p className="">{convertDateFormat(task.start_date)} - {convertDateFormat(task.end_date)}</p>
                        </div>
                      </span>

                      <span className="ml-8 h-8 my-auto w-[150px]">
                        <div className="text-gray-400 h-8 w-[150px] flex font-semibold">
                          <span className="w-fit h-fit m-auto flex">
                            <a href={`http://localhost:9000/okr.task/${task.file}`} target="_blank" className={`${task.file === '#' ? 'hidden' : 'block'}`}>
                              <div className="h-8 w-12 bg-unggu text-white flex rounded-xl">
                                <AiFillFile size={'20px'} className='w-fit h-fit m-auto' />
                              </div>
                            </a>
                            <a href={`https://${task.link}`} target="_blank" className={`${task.link === '' ? 'hidden' : 'block'}`}>
                              <div className="h-8 w-12 bg-unggu text-white ml-2 flex rounded-xl">
                                <ImLink size={'20px'} className='w-fit h-fit m-auto' />
                              </div>
                            </a>
                          </span>

                        </div>
                      </span>

                      <span className="ml-5 flex my-auto w-[150px]">
                        <div className={`h-8 flex font-semibold w-fit mx-auto px-2 rounded-lg text-white ${task.status === "Selesai" ? "bg-Hijau-tua" : task.status === "Pending" ? "bg-Gold" : "bg-gray-300"}`}>
                          <p className="m-auto">{task.status}</p>
                        </div>
                      </span>

                      <div className='relative w-[100px] h-[100px] flex my-auto'>
                        {userRole === 'Admin' && (

                          <div className="w-fit m-auto cursor-pointer" onClick={() => { handleClickID(task._id) }}>
                            <BsThreeDotsVertical size={'20px'} />
                          </div>
                        )}

                        {showEditDanApus[task._id] && (
                          <div className="absolute inset-0 p-3 items-center justify-center z-10 w-[170px] h-fit shadow-lg shadow-black/20 bg-white -left-32 rounded-xl top-[50px] border " >
                            <div className="flex">
                              <p className='font-semibold'>Detail</p>
                              <div className="w-fit h-fit ml-auto text-xs cursor-pointer" onClick={() => setshowEditDanApus(false)}>
                                X
                              </div>
                            </div>

                            <div className="flex w-full mt-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2" onClick={() => handleClickEdit(IDObjek)}>
                              <span className=" my-auto">
                                <BiPencil size={'20px'} />
                              </span>

                              <p className="ml-2 my-auto">Edit</p>
                            </div>

                            <hr className="my-3 w-[160px] -ml-2 " />

                            <div className="flex w-full cursor-pointer text-red-500 hover:bg-gray-100 rounded-lg p-2" onClick={() => {
                              handleDelete(IDObjek);
                            }}>
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
                  ))
                ) : (
                  <div className="mt-2 font-semibold">Belum ada data progres...</div>
                )}
              </div>

            ) : (
              <div className="">
                {filteredDataBYID ? (
                  filteredDataBYID.map((task, index) => (
                    <div key={task._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                      <span className="ml-5 my-auto w-[300px]">
                        <p className=" font-semibold w-[300px]">{task.nama}</p>
                      </span>

                      <div className="ml-5 my-auto flex w-[100px]">
                        <span className='w-fit mx-auto flex'>
                          <img src={`http://localhost:9000/okr.profile/${task.foto_profile}`}
                            className='w-10 h-10 border-2 border-white rounded-[100%]' />
                        </span>
                      </div>


                      <span className="ml-5 my-auto w-[200px]">
                        <div className="text-gray-400 flex font-semibold w-fit mx-auto">
                          <p className="">{convertDateFormat(task.start_date)} - {convertDateFormat(task.end_date)}</p>
                        </div>
                      </span>

                      <span className="ml-8 h-8 my-auto w-[150px]">
                        <div className="text-gray-400 h-8 w-[150px] flex font-semibold">
                          <span className="w-fit h-fit m-auto flex">
                            <a href={`http://localhost:9000/okr.task/${task.file}`} target="_blank" className={`${task.file === '#' ? 'hidden' : 'block'}`}>
                              <div className="h-8 w-12 bg-unggu text-white flex rounded-xl">
                                <AiFillFile size={'20px'} className='w-fit h-fit m-auto' />
                              </div>
                            </a>
                            <a href={`https://${task.link}`} target="_blank" className={`${task.link === '' ? 'hidden' : 'block'}`}>
                              <div className="h-8 w-12 bg-unggu text-white ml-2 flex rounded-xl">
                                <ImLink size={'20px'} className='w-fit h-fit m-auto' />
                              </div>
                            </a>
                          </span>

                        </div>
                      </span>

                      <span className="ml-5 flex my-auto w-[150px]">
                        <div className={`h-8 flex font-semibold w-fit mx-auto px-2 rounded-lg text-white ${task.status === "Selesai" ? "bg-Hijau-tua" : task.status === "Pending" ? "bg-Gold" : "bg-gray-300"}`}>
                          <p className="m-auto">{task.status}</p>
                        </div>
                      </span>

                      <div className='relative w-[140px] h-[100px] mx-auto flex my-auto'>
                        {task.status === 'Selesai' ? (
                          <div className="m-auto w-[140px] h-[40px] flex border-unggu border rounded-xl cursor-pointer" onClick={() => { handleClickVIEWprogrestask(task._id) }}>
                            <p className="w-fit h-fit flex m-auto font-semibold text-base">
                              view
                            </p>
                          </div>
                        ) : task.status === 'Pending' ? (
                          <div className="m-auto w-[140px] h-[40px] flex border-unggu border rounded-xl cursor-pointer " onClick={() => { handleClickEditprogrestask(task._id) }}>
                            <p className="w-fit h-fit flex m-auto font-semibold text-base">
                              <span className="w-fit h-fit my-auto mr-2"><BiPencil size={'20px'} /></span> Edit
                            </p>
                          </div>
                        ) : (
                          <div className="m-auto w-[140px] h-[40px] flex border-unggu border rounded-xl cursor-pointer " onClick={() => { handleClickTambahprogrestask(task._id) }}>
                            <p className="w-fit h-fit flex m-auto font-semibold text-base">
                              <span className="w-fit h-fit my-auto mr-2"><BiPencil size={'20px'} /></span> Kumpulkan
                            </p>
                          </div>
                        )}

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="mt-2 font-semibold">Belum ada data progres...</div>
                )}
              </div>
            )}


          </div>
        </div>




        {/* #FF0000 */}

        {showVIEWprogrestask && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-full md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-close flex z-50">
                <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                  <h1>View Progres Task</h1>
                </div>
                <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                  <div className='ml-auto w-[40px] flex h-[40px]p-1 rounded-[100%]' onClick={() => setshowVIEWprogrestask(false)}>
                    <p className=' w-fit h-fit text-black m-auto '>X</p>
                  </div>
                </div>
              </div>

              <div className="modal-content py-4 text-left px-6">
                {dataTaskBYID ? (
                  <div className="w-full h-fit">
                    <div className="w-full h-fit max-h-[500px] overflow-auto">
                      <div className="w-full h-fit">
                        <p className="w-full h-fit font-semibold mb-2 text-2xl">{dataTaskBYID.nama}</p>
                        <p className="w-full h-fit font-semibold mb-3 text-base">{calculateProjectDurationInHours(dataTaskBYID.start_date)} jam Yang lalu</p>


                        <div className="flex w-full">
                          <div className="">
                            <p className="w-full h-fit font-semibold text-lg">Deadline</p>
                            <div className="flex w-[180px] h-8 rounded-lg bg-blue-200 border ">
                              <p className="w-fit h-fit m-auto text-center font-semibold text-sm">
                                {calculateTimeRemaining(dataTaskBYID.end_date).days} hari {calculateTimeRemaining(dataTaskBYID.end_date).hours} jam {calculateTimeRemaining(dataTaskBYID.end_date).minutes}
                                Menit</p>
                            </div>
                          </div>
                          <div className="ml-10">
                            <p className="w-full h-fit font-semibold text-lg">Assigned To</p>

                            <span className='w-fit mx-auto flex'>
                              <img src={`http://localhost:9000/okr.profile/${dataTaskBYID.foto_profile}`}
                                className='w-10 h-10 border-2 border-white rounded-[100%]' />
                              <p className="w-fit h-fit my-auto ml-3">{dataTaskBYID.nama_profile}</p>
                            </span>

                          </div>
                        </div>

                        <hr className='my-5' />

                        <div className="flex w-full h-fit mb-5">
                          <div className="w-fit h-fit">
                            <HiOutlineMenuAlt2 size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-fit h-fit text-lg font-semibold' >Description</p>
                            <p className="w-fit h-fit mt-2">{dataTaskBYID.deskripsi}</p>
                          </div>
                        </div>

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Lampiran</p>

                            <a href={`http://localhost:9000/okr.task/${dataTaskBYID.file}`} target="_blank" >
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiFillFile size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.file}</p>
                                </div>
                              </div>
                            </a>

                            <a href={`https://${dataTaskBYID.link}`} target="_blank">
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiOutlineLink size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.link}</p>
                                </div>
                              </div>
                            </a>

                          </div>
                        </div>

                        <hr className='my-5 ' />

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Progres Task</p>


                            <div className="w-[667px] h-fit mt-5">
                              <form action="" className=''>

                                <div className='mb-2 hidden'>
                                  <input type="text" name='id_task' placeholder='Nama' onChange={handleEDITChangeProgrestask} value={dataTaskBYID._id || formDataEditprogrestask.id_task}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='note' placeholder='Note' onChange={handleEDITChangeProgrestask} value={formDataEditprogrestask.note}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='w-[230px] mb-2'>
                                  <input type="datetime-local" name='tanggal' value={currentDatetime || formDataEditprogrestask.tanggal} disabled onChange={handleEDITChangeProgrestask}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='link' placeholder='link' onChange={handleEDITChangeProgrestask} value={formDataEditprogrestask.link}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className="w-full h-fit">
                                  {imageProgrestask.map((preview, index) => (
                                    <div key={index} className="flex w-full h-10 mb-2 bg-gray-100 rounded-lg px-5">
                                      <p className="h-fit w-fit my-auto">{preview}</p>

                                    </div>
                                  ))
                                  }
                                </div>
                              </form>

                            </div>

                          </div>
                        </div>



                      </div>
                    </div>


                  </div>


                ) : (
                  <p>Loading...</p>
                )}
              </div>

            </div>

          </div>

        )}


        {showTambahprogrestask && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-full md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-close flex z-50">
                <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                  <h1>Tambah progrestask</h1>
                </div>
                <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                  <div className='ml-auto w-[40px] flex h-[40px]p-1 rounded-[100%]' onClick={() => setshowTambahprogrestask(false)}>
                    <p className=' w-fit h-fit text-black m-auto '>X</p>
                  </div>
                </div>
              </div>

              <div className="modal-content py-4 text-left px-6">
                {dataTaskBYID ? (
                  <div className="w-full h-fit">
                    <div className="w-full h-fit max-h-[500px] overflow-auto">
                      <div className="w-full h-fit">
                        <p className="w-full h-fit font-semibold mb-2 text-2xl">{dataTaskBYID.nama}</p>
                        <p className="w-full h-fit font-semibold mb-3 text-base">{calculateProjectDurationInHours(dataTaskBYID.start_date)} jam Yang lalu</p>


                        <div className="flex w-full">
                          <div className="">
                            <p className="w-full h-fit font-semibold text-lg">Deadline</p>
                            <div className="flex w-[180px] h-8 rounded-lg bg-blue-200 border ">
                              <p className="w-fit h-fit m-auto text-center font-semibold text-sm">
                                {calculateTimeRemaining(dataTaskBYID.end_date).days} hari {calculateTimeRemaining(dataTaskBYID.end_date).hours} jam {calculateTimeRemaining(dataTaskBYID.end_date).minutes}
                                Menit</p>
                            </div>
                          </div>
                          <div className="ml-10">
                            <p className="w-full h-fit font-semibold text-lg">Assigned To</p>

                            <span className='w-fit mx-auto flex'>
                              <img src={`http://localhost:9000/okr.profile/${dataTaskBYID.foto_profile}`}
                                className='w-10 h-10 border-2 border-white rounded-[100%]' />
                              <p className="w-fit h-fit my-auto ml-3">{dataTaskBYID.nama_profile}</p>
                            </span>

                          </div>
                        </div>

                        <hr className='my-5' />

                        <div className="flex w-full h-fit mb-5">
                          <div className="w-fit h-fit">
                            <HiOutlineMenuAlt2 size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-fit h-fit text-lg font-semibold' >Description</p>
                            <p className="w-fit h-fit mt-2">{dataTaskBYID.deskripsi}</p>
                          </div>
                        </div>

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Lampiran</p>

                            <a href={`http://localhost:9000/okr.task/${dataTaskBYID.file}`} target="_blank">
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiFillFile size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.file}</p>
                                </div>
                              </div>
                            </a>

                            <a href={`https://${dataTaskBYID.link}`} target="_blank">
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiOutlineLink size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.link}</p>
                                </div>
                              </div>
                            </a>

                          </div>
                        </div>

                        <hr className='my-5 ' />

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Form Progres Task</p>


                            <div className="w-[667px] h-fit mt-5">
                              <form action="" className='' onSubmit={handleSubmitProgrestask} encType="multipart/form-data">

                                <div className='mb-2 hidden'>
                                  <input type="text" name='id_task' placeholder='Nama' onChange={handleInputChangeProgrestask} value={dataTaskBYID._id}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='note' placeholder='Note' onChange={handleInputChangeProgrestask}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='w-[230px] mb-2'>
                                  <input type="datetime-local" name='tanggal' value={currentDatetime} disabled onChange={handleInputChangeProgrestask}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='link' placeholder='link' onChange={handleInputChangeProgrestask}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className="w-full h-fit">
                                  {INPUTimageProgrestask && INPUTimageProgrestask.map((preview, index) => (
                                    <div key={index} className="flex w-full h-10 mb-2 bg-gray-100 rounded-lg px-5">
                                      <p className="h-fit w-fit my-auto">{preview}</p>
                                      <div
                                        className="text-gray-600 ml-auto my-auto text-lg flex font-medium p-1 w-10 h-10 rounded-full cursor-pointer"
                                        onClick={() => handleInputChangeProgrestask({ target: { name: 'removeFile', value: index } })}
                                      >
                                        <p className="w-fit h-fit m-auto">X</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>


                                <input type="file" name="files" id="file-input" required autoFocus multiple
                                  onChange={handleInputChangeProgrestask} style={{ display: 'none' }}
                                  className="px-2 border-2 font-mono text-black text-base mx-auto w-full mb-5" />

                                <div className="mx-auto w-full border-2 cursor-pointer border-dashed h-10 flex"
                                  onClick={() => document.getElementById('file-input').click()}>

                                  <div className="w-fit text-unggu m-auto px-2 py-1 rounded-md">
                                    + Tambah File
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
                    </div>


                  </div>


                ) : (
                  <p>Loading...</p>
                )}

                {/* <div className="w-10 mt-20"></div> */}
              </div>

            </div>

          </div>

        )}


        {showEditprogrestask && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-full md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-close flex z-50">
                <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                  <h1>Edit Progres Task</h1>
                </div>
                <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                  <div className='ml-auto w-[40px] flex h-[40px]p-1 rounded-[100%]' onClick={() => setshowEditprogrestask(false)}>
                    <p className=' w-fit h-fit text-black m-auto '>X</p>
                  </div>
                </div>
              </div>

              <div className="modal-content py-4 text-left px-6">
                {dataTaskBYID ? (
                  <div className="w-full h-fit">
                    <div className="w-full h-fit max-h-[500px] overflow-auto">
                      <div className="w-full h-fit">
                        <p className="w-full h-fit font-semibold mb-2 text-2xl">{dataTaskBYID.nama}</p>
                        <p className="w-full h-fit font-semibold mb-3 text-base">{calculateProjectDurationInHours(dataTaskBYID.start_date)} jam Yang lalu</p>


                        <div className="flex w-full">
                          <div className="">
                            <p className="w-full h-fit font-semibold text-lg">Deadline</p>
                            <div className="flex w-[180px] h-8 rounded-lg bg-blue-200 border ">
                              <p className="w-fit h-fit m-auto text-center font-semibold text-sm">
                                {calculateTimeRemaining(dataTaskBYID.end_date).days} hari {calculateTimeRemaining(dataTaskBYID.end_date).hours} jam {calculateTimeRemaining(dataTaskBYID.end_date).minutes}
                                Menit</p>
                            </div>
                          </div>
                          <div className="ml-10">
                            <p className="w-full h-fit font-semibold text-lg">Assigned To</p>

                            <span className='w-fit mx-auto flex'>
                              <img src={`http://localhost:9000/okr.profile/${dataTaskBYID.foto_profile}`}
                                className='w-10 h-10 border-2 border-white rounded-[100%]' />
                              <p className="w-fit h-fit my-auto ml-3">{dataTaskBYID.nama_profile}</p>
                            </span>

                          </div>
                        </div>

                        <hr className='my-5' />

                        <div className="flex w-full h-fit mb-5">
                          <div className="w-fit h-fit">
                            <HiOutlineMenuAlt2 size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-fit h-fit text-lg font-semibold' >Description</p>
                            <p className="w-fit h-fit mt-2">{dataTaskBYID.deskripsi}</p>
                          </div>
                        </div>

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Lampiran</p>

                            <a href={`http://localhost:9000/okr.task/${dataTaskBYID.file}`} target="_blank">
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiFillFile size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.file}</p>
                                </div>
                              </div>
                            </a>

                            <a href={`https://${dataTaskBYID.link}`} target="_blank">
                              <div className="flex w-[667px] mt-2 h-fit min-h-[40px] max-h-[60px] mb-2 bg-gray-100 rounded-lg px-5">
                                <div className="my-auto w-fit h-fit max-h-[60px] flex  py-2 text-gray-400 text-xs">
                                  <AiOutlineLink size={'28px'} className='w-fit h-fit ' />
                                  <p className="w-fit h-fit my-auto ml-2">{dataTaskBYID.link}</p>
                                </div>
                              </div>
                            </a>

                          </div>
                        </div>

                        <hr className='my-5 ' />

                        <div className="flex w-full h-fit">
                          <div className="w-fit h-fit">
                            <MdAttachment size={'28px'} className='w-fit h-fit ' />
                          </div>
                          <div className="w-fit h-fit ml-2">
                            <p className='w-[667px] h-fit text-lg font-semibold' >Form Progres Task</p>


                            <div className="w-[667px] h-fit mt-5">
                              <form action="" className=''>

                                <div className='mb-2 hidden'>
                                  <input type="text" name='id_task' placeholder='Nama' onChange={handleEDITChangeProgrestask} value={dataTaskBYID._id || formDataEditprogrestask.id_task}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='note' placeholder='Note' onChange={handleEDITChangeProgrestask} value={formDataEditprogrestask.note}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='w-[230px] mb-2'>
                                  <input type="datetime-local" name='tanggal' value={currentDatetime || formDataEditprogrestask.tanggal} disabled onChange={handleEDITChangeProgrestask}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className='mb-2'>
                                  <input type="text" name='link' placeholder='link' onChange={handleEDITChangeProgrestask} value={formDataEditprogrestask.link}
                                    className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                                </div>

                                <div className="w-full h-fit">
                                  {imageSebelum ? imageSebelum.map((preview, index) => (
                                    <div key={index} className="flex w-full h-10 mb-2 bg-gray-100 rounded-lg px-5">
                                      <p className="h-fit w-fit my-auto">{preview}</p>
                                    </div>
                                  )) : (
                                    <div className="w-full h-fit flex">
                                    </div>
                                  )}
                                  {imageProgrestask.map((preview, index) => (
                                    <div key={index} className="flex w-full h-10 mb-2 bg-gray-100 rounded-lg px-5">
                                      <p className="h-fit w-fit my-auto">{preview}</p>
                                      <div className="text-gray-600 ml-auto my-auto text-lg flex font-medium p-1 w-10 h-10 rounded-full cursor-pointer"
                                        onClick={() => handleEDITChangeProgrestask({ target: { name: 'removeFile', value: index } })}>
                                        <p className="w-fit h-fit m-auto">X</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>



                                <input type="file" name="files" id="file-input" multiple
                                  onChange={handleEDITChangeProgrestask} style={{ display: 'none' }}
                                  className="px-2 border-2 font-mono text-black text-base mx-auto w-full mb-5" />

                                <div className="mx-auto w-full border-2 cursor-pointer border-dashed h-10 flex"
                                  onClick={() => document.getElementById('file-input').click()}>

                                  <div className="w-fit text-unggu m-auto px-2 py-1 rounded-md">
                                    + Tambah File
                                  </div>
                                </div>

                                <div className='w-full mx-auto mt-10'>
                                  <input type="submit" value="Tambah Progres Task" onClick={handleSubmitEditProgrestask}
                                    className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                                </div>

                              </form>

                            </div>

                          </div>
                        </div>



                      </div>
                    </div>


                  </div>


                ) : (
                  <p>Loading...</p>
                )}
              </div>

            </div>

          </div>

        )}

        {showEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-full md:max-w-5xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
              <div className="modal-close flex z-50">
                <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                  <h1>Edit Task</h1>
                </div>
                <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                  <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowEdit(false)}>
                    <p className=' w-fit h-fit text-white m-auto '>X</p>
                  </div>
                </div>
              </div>

              <div className="modal-content py-4 text-left px-6">
                <div className="w-auto"></div>
                <form action="" onSubmit={handleSubmitEdit} className='' encType="multipart/form-data">
                  <div className="flex w-full">
                    <div className="w-[480px] h-fit ">
                      <div className='mb-2'>
                        <label htmlFor="" className='ml-2'>Nama</label><br />
                        <input type="text" name='nama' placeholder='Nama' value={formDataEdit.nama} onChange={handleInputChangeEdit}
                          className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                      </div>

                      <div className="flex w-full mb-2">
                        <div className='w-[230px] '>
                          <label htmlFor="" className='ml-2'>Start date</label><br />
                          <input type="datetime-local" name='start_date' value={formDataEdit.start_date} disabled onChange={handleInputChangeEdit}
                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                        </div>
                        <div className='w-[230px] ml-auto'>
                          <label htmlFor="" className='ml-2'>End date</label><br />
                          <input type="datetime-local" name='end_date' value={formDataEdit.end_date} onChange={handleInputChangeEdit}
                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                        </div>
                      </div>

                      <label htmlFor="" className='ml-2'>Assign to</label><br />
                      <div className='mb-2'>
                        <div className="flex">
                          <select name="DIvisi" onChange={handleDivisiChange} value={searchDivisi}
                            className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                            <option value="">Divisi</option>
                            {DAtatDivisi.map((tim) => (
                              <option key={tim._id} value={tim.nama}>
                                {tim.nama}
                              </option>
                            ))}
                          </select>

                          <input type="text" name="nama" placeholder="Cari nama" value={searchNama} onChange={handleNamaChange}
                            className="px-2 py-2 bg-gray-200 mt-1 h-[41px] ml-2 rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                          />

                        </div>

                        <select name="assign_to" onChange={handleInputChangeEdit}
                          className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                        >
                          <option value={formDataEdit.assign_to}>{formDataEdit.nama_profile}</option>
                          {filteredTim.map((tim) => (
                            <option key={tim._id} value={tim._id}>
                              {tim.nama} / {tim.divisi}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="w-[480px] h-fit ml-auto">

                      <div className='mb-[5.60px] '>
                        <label htmlFor="" className='ml-2'>Deskripsi</label><br />
                        <textarea type="text" name='deskripsi' placeholder='Deskripsi' value={formDataEdit.deskripsi} onChange={handleInputChangeEdit}
                          className="min-h-[41px] max-h-[122px] px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full" />
                      </div>

                      <div className='mb-2'>
                        <label htmlFor="" className='ml-2'>Link</label><br />
                        <input type="text" name='link' placeholder='Add Link' value={formDataEdit.link} onChange={handleInputChangeEdit}
                          className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                      </div>

                      <div className='mb-2'>
                        <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleInputChangeEdit}
                          className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />

                        <div className="flex">
                          <div className="px-2 py-2 flex bg-gray-200 my-auto w-[100px] cursor-pointer hover:bg-black hover:text-white hover:font-semibold transition duration-500 h-[41px] rounded-md font-mono text-black text-base mx-auto">
                            <div className="w-fit h-fit m-auto flex" onClick={() => document.getElementById('file-input').click()}>
                              <p className="w-fit h-fit m-auto">Add File</p>
                            </div>
                          </div>

                          <div className="ml-3 bg-gray-200 my-auto h-fit min-h-[40px] max-h-[60px] flex rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                            {image && (
                              <div className="my-auto w-fit h-fit max-h-[60px] px-2 py-2 text-gray-400 text-xs">
                                {image}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>



                  </div>

                  <div className='w-full mx-auto mt-10'>
                    <input type="submit" value="Edit Task"
                      className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                  </div>

                </form>

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
                  <h1>Tambah Task</h1>
                </div>
                <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                  <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowTambah(false)}>
                    <p className=' w-fit h-fit text-white m-auto '>X</p>
                  </div>
                </div>
              </div>

              <div className="modal-content py-4 text-left px-6">
                <div className="w-auto">
                  <form action="" onSubmit={handleSubmit} className='' encType="multipart/form-data">
                    <div className="flex w-full">
                      <div className="w-[480px] h-fit ">
                        <div className='mb-2'>
                          <label htmlFor="" className='ml-2'>Nama</label><br />
                          <input type="text" name='nama' placeholder='Nama' onChange={handleInputChange}
                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                        </div>

                        <div className="flex w-full mb-2">
                          <div className='w-[230px] '>
                            <label htmlFor="" className='ml-2'>Start date</label><br />
                            <input type="datetime-local" name='start_date' value={currentDatetime} disabled onChange={handleInputChange}
                              className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                          </div>
                          <div className='w-[230px] ml-auto'>
                            <label htmlFor="" className='ml-2'>End date</label><br />
                            <input type="datetime-local" name='end_date' onChange={handleInputChange}
                              className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                          </div>
                        </div>

                        <label htmlFor="" className='ml-2'>Assign to</label><br />
                        <div className='mb-2'>
                          <div className="flex">
                            <select name="DIvisi" onChange={handleDivisiChange} value={searchDivisi}
                              className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                              <option value="">Divisi</option>
                              {DAtatDivisi.map((tim) => (
                                <option key={tim._id} value={tim.nama}>
                                  {tim.nama}
                                </option>
                              ))}
                            </select>

                            <input type="text" name="nama" placeholder="Cari nama" value={searchNama} onChange={handleNamaChange}
                              className="px-2 py-2 bg-gray-200 mt-1 h-[41px] ml-2 rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                            />

                          </div>

                          <select name="assign_to" onChange={handleInputChange}
                            className="px-2 py-2 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1"
                          >
                            <option value="">Pilih Assign to</option>
                            {filteredTim.map((tim) => (
                              <option key={tim._id} value={tim._id}>
                                {tim.nama} / {tim.divisi}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>

                      <div className="w-[480px] h-fit ml-auto">

                        <div className='mb-[5.60px] '>
                          <label htmlFor="" className='ml-2'>Deskripsi</label><br />
                          <textarea type="text" name='deskripsi' placeholder='Deskripsi' onChange={handleInputChange}
                            className="min-h-[41px] max-h-[122px] px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full" />
                        </div>

                        <div className='mb-2'>
                          <label htmlFor="" className='ml-2'>Link</label><br />
                          <input type="text" name='link' placeholder='Add Link' onChange={handleInputChange}
                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />
                        </div>

                        <div className='mb-2'>
                          <input type="file" name='file' style={{ display: 'none' }} id="file-input" onChange={handleInputChange}
                            className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" />

                          <div className="flex">
                            <div className="px-2 py-2 flex bg-gray-200 my-auto w-[100px] cursor-pointer hover:bg-black hover:text-white hover:font-semibold transition duration-500 h-[41px] rounded-md font-mono text-black text-base mx-auto">
                              <div className="w-fit h-fit m-auto flex" onClick={() => document.getElementById('file-input').click()}>
                                <p className="w-fit h-fit m-auto">Add File</p>
                              </div>
                            </div>

                            <div className="ml-3 bg-gray-200 my-auto h-fit min-h-[40px] max-h-[60px] flex rounded-md font-mono text-black text-base mx-auto w-full mb-1">
                              {image && (
                                <div className="my-auto w-fit h-fit max-h-[60px] px-2 py-2 text-gray-400 text-xs">
                                  {image}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>



                    </div>

                    <div className='w-full mx-auto mt-10'>
                      <input type="submit" value="Tambah Task"
                        className='w-full h-[35px] rounded-xl font-semibold text-xl text-white cursor-pointer bg-unggu' />
                    </div>

                  </form>

                </div>

              </div>

            </div>
          </div>

        )}

        <div className='h-[10px] mt-5'></div>
      </div>


    </div >
  )
}
