import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import Logo from "./../foto/No.png";



import { IoIosAddCircle } from "react-icons/io";
import { GoPasskeyFill } from "react-icons/go";
import { HiOutlineKey, HiOutlineMenuAlt2 } from "react-icons/hi";
import { ImLink } from "react-icons/im";
import { MdAttachment } from "react-icons/md";
import { AiFillFile, AiFillCaretRight, AiFillCheckCircle, AiOutlineLink } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

export const ApprovingTask = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [dataPending, setdataPending] = useState(null); // Menambahkan state data
  const [dataProgres, setdataProgres] = useState(null); // Menambahkan state data
  const [IDProgres, setIDProgres] = useState(null); // Menambahkan state data
  const [IDKeyresult, setIDKeyresult] = useState(null); // Menambahkan state data
  const [showApproving, setshowApproving] = useState(false); // Tambahkan state untuk popup pengeditan
  const [showVIEWprogrestask, setshowVIEWprogrestask] = useState(false); // Tambahkan state untuk popup pengeditan
  const [IDObjek, setIDObjek] = useState(null); // Menambahkan state data
  const [dataTaskBYID, setdataTaskBYID] = useState(null); // Menambahkan state data
  const [imageSebelum, setImageSebelum] = useState([]);
  const [DataProges, setDataProges] = useState([]);
  const [IDTask, setIDTask] = useState([]);







  useEffect(() => {
    // Pastikan peran pengguna telah diambil dari local storage
    const role = localStorage.getItem('role');
    setUserRole(role);

    axios.get(`http://localhost:3050/task/status/pending`)
      .then((response) => {
        console.log('Data pendingprogrestask', response.data.pendingtask);
        const Data = response.data.pendingtask;
        setdataPending(Data)



      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, []);

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
    const formattedDatetime = `${hour}:${minute} - ${day}.${month}.${year}`;
    return formattedDatetime;
  }


  const handleClick = (id) => {
    setIDProgres(id);
    setshowApproving(true);
  }
  const handleClickKY = (id) => {
    setIDKeyresult(id);
  }

  console.log('IDProgres', IDProgres);
  console.log('IDKeyresult', IDKeyresult);

  const [NamaKeyResult, setNamaKeyResult] = useState(null); // Menambahkan state data
  const [untukey, setuntukey] = useState(null); // Menambahkan state data


  useEffect(() => {
    axios.get(`http://localhost:3050/keyresult/${IDKeyresult}`)
      .then((response) => {
        console.log('dataaaaaaaaaaaa', response.data.keyresult);
        const nama = response.data.keyresult.nama;
        const Data = response.data.keyresult.nama_profile;
        setNamaKeyResult(nama);
        setuntukey(Data);

      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDKeyresult]);


  useEffect(() => {
    axios.get(`http://localhost:3050/progres/getdata/${IDProgres}`)
      .then((response) => {
        console.log('DATAAAAAAAA', response.data.progres);
        const Data = response.data.progres;
        setdataProgres(Data);


      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDProgres]);

  console.log('IDKeyresult', IDKeyresult);


  const handleClickVIEWprogrestask = (id) => {
    setIDObjek(id);
    setshowVIEWprogrestask(true);
  }

  useEffect(() => {
    axios.get(`http://localhost:3050/task/${IDObjek}`)
      .then((response) => {
        console.log('Data BY ID responseresponse', response.data.task);
        const Data = response.data.task;
        console.log('DATA', Data);
        setdataTaskBYID(Data);

        // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });
    axios.get(`http://localhost:3050/progrestask/task/${IDObjek}`)
      .then((response) => {
        console.log('progrestask', response.data.progresTask[0]);
        const Data = response.data.progresTask[0];
        console.log('DATA formDataEditprogrestask', Data._id);
        // setIDKeyresult(id);

        setDataProges(Data);
        setImageSebelum(Data.files);
        setIDTask(Data._id);



        // setSelectedTim(initialSelectedTim); // Set selectedTim juga untuk menggambarkan data yang sudah terpilih
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });

  }, [IDObjek]);



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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }
      Swal.fire({
        title: 'Approve ?',
        text: "Kamu yakin mau Approve",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.put(
              `http://localhost:3050/progrestask/acc/${IDTask}/approve`,
              null,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              const responseData = response.data.newObjekti;
              console.log('Respon dari server (berhasil):', responseData);

              Swal.fire({
                title: 'Sukses',
                text: 'Approve berhasil!',
                icon: 'success',
                confirmButtonText: 'OKE',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = `/ApprovingTask`;
                }
              });
            } else {
              console.error('Approve gagal');

              Swal.fire('Error', 'Approve gagal', 'error');
            }
          } catch (error) {
            console.error('Terjadi kesalahan:', error);

            Swal.fire('Error', 'Terjadi kesalahan', 'error');
          }
        }
      });
    } catch (error) {
      console.error('Terjadi kesalahan:', error);

      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };




  // #FFFF
  return (
    <div className='flex w-full bg-gray-100/60 h-full font-Poppins' style={{ backgroundSize: 'cover' }}>

      <div className="w-[260px]"></div>

      <div className="w-[1260px]">

        <div className='h-[70px]'></div>

        <div className="w-[1200px] mx-auto mt-5">

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


            {dataPending ? (
              dataPending.map((Pending, index) => (
                <div key={Pending._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                  <span className="ml-5 my-auto w-[300px]">
                    <p className=" font-semibold w-[300px]">{Pending.nama}</p>
                  </span>

                  <div className="ml-5 my-auto flex w-[100px]">
                    <span className='w-fit mx-auto flex'>
                      <img src={`http://localhost:9000/okr.profile/${Pending.foto_profile}`}
                        className='w-10 h-10 border-2 border-white rounded-[100%]' />
                    </span>
                  </div>


                  <span className="ml-5 my-auto w-[200px]">
                    <div className="text-gray-400 flex font-semibold w-fit mx-auto">
                      <p className="">{convertDateFormat(Pending.start_date)} - {convertDateFormat(Pending.end_date)}</p>
                    </div>
                  </span>

                  <span className="ml-8 h-8 my-auto w-[150px]">
                    <div className="text-gray-400 h-8 w-[150px] flex font-semibold">
                      <span className="w-fit h-fit m-auto flex">
                        <a href={`http://localhost:9000/okr.task/${Pending.file}`} target="_blank" className={`${Pending.file === '#' ? 'hidden' : 'block'}`}>
                          <div className="h-8 w-12 bg-unggu text-white flex rounded-xl">
                            <AiFillFile size={'20px'} className='w-fit h-fit m-auto' />
                          </div>
                        </a>
                        <a href={`https://${Pending.link}`} target="_blank" className={`${Pending.link === '' ? 'hidden' : 'block'}`}>
                          <div className="h-8 w-12 bg-unggu text-white ml-2 flex rounded-xl" >
                            <ImLink size={'20px'} className='w-fit h-fit m-auto' />
                          </div>
                        </a>
                      </span>

                    </div>
                  </span>

                  <span className="ml-5 flex my-auto w-[150px]">
                    <div className={`h-8 flex font-semibold w-fit mx-auto px-2 rounded-lg text-white ${Pending.status === "Selesai" ? "bg-Hijau-tua" : Pending.status === "Pending" ? "bg-Gold" : "bg-gray-300"}`}>
                      <p className="m-auto">{Pending.status}</p>
                    </div>
                  </span>
                  <div className='relative w-[140px] h-[100px] mx-auto flex my-auto' onClick={() => { handleClickVIEWprogrestask(Pending._id) }}>
                    <div className="m-auto w-[140px] h-[40px] flex border-unggu border rounded-xl cursor-pointer">
                      <p className="w-fit h-fit flex m-auto font-semibold text-base">
                        view
                      </p>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="w-full h-fit flex">
                <div className="w-fit h-fit mx-auto">
                  <img src={Logo} alt="" className='w-[450px]' />
                  <div className="mt-6"></div>
                </div>
              </div>
            )}

          </div>

          {showVIEWprogrestask && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
              <div className="modal-container bg-white w-full md:max-w-3xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-close flex z-50">
                  <div className='w-fit h-fit my-auto ml-6 text-2xl font-bold'>
                    <h1>View progrestask</h1>
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
                              <p className='w-[667px] h-fit text-lg font-semibold' >Progres Task</p>


                              <div className="w-[667px] h-fit mt-5">
                                <form action="" className=''>

                                  <div className='mb-5'>
                                    <p className="w-fit h-fit">Note</p>
                                    <div className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" >
                                      <p className="w-fit h-fit my-auto">{DataProges.note}</p>
                                    </div>
                                  </div>

                                  <div className='w-[230px] mb-5'>
                                    <p className="w-fit h-fit">Tanggal</p>

                                    <div className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" >
                                      <p className="w-fit h-fit my-auto">{convertDateFormat(DataProges.tanggal)}</p>
                                    </div>
                                  </div>

                                  <div className='mb-5'>
                                    <p className="w-fit h-fit">Link</p>
                                    <a href={`https://${DataProges.link}`} target="_blank">
                                      <div className="px-2 py-3 bg-gray-200 mt-1 h-[41px] rounded-md font-mono text-black text-base mx-auto w-full mb-1" >
                                        <p className="w-fit h-fit my-auto">{DataProges.link}</p>
                                      </div>
                                    </a>
                                  </div>

                                  <div className="w-full h-fit">
                                    <p className="w-fit h-fit">File</p>
                                    {imageSebelum.map((preview, index) => (
                                      <div key={index}>
                                        <a href={`http://localhost:9000/okr.progrestask/${preview}`} target="_blank">
                                          <div className="flex w-full h-10 mb-2 bg-gray-100 rounded-lg px-5">
                                            <p className="h-fit w-fit my-auto">{preview}</p>
                                          </div>
                                        </a>
                                      </div>
                                    ))
                                    }
                                  </div>
                                </form>

                              </div>

                            </div>
                          </div>

                          <div className="px-2 py-2 flex mt-5 bg-[#00E879] w-full h-[50px]  rounded-md  text-black/90 text-base mx-auto mb-1 cursor-pointer" onClick={handleLogout}>
                            <div className="flex m-auto h-fit w-fit text-white">
                              <AiFillCheckCircle size={'30px'} className='w-fit text-white h-fit my-auto' />
                              <p className="h-fit w-fit ml-5 my-auto font-bold text-lg">Approve</p>
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



        </div>
      </div >
    </div >
  )
}
