import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';


import { IoIosAddCircle } from "react-icons/io";
import { GoPasskeyFill } from "react-icons/go";
import { HiOutlineKey } from "react-icons/hi";
import { ImLink } from "react-icons/im";
import { AiFillFile, AiFillCaretRight, AiFillCheckCircle } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxOpenInNewWindow } from "react-icons/rx";

export const Approving = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [dataPending, setdataPending] = useState(null); // Menambahkan state data
  const [dataProgres, setdataProgres] = useState(null); // Menambahkan state data
  const [IDProgres, setIDProgres] = useState(null); // Menambahkan state data
  const [IDKeyresult, setIDKeyresult] = useState(null); // Menambahkan state data
  const [showApproving, setshowApproving] = useState(false); // Tambahkan state untuk popup pengeditan




  useEffect(() => {
    // Pastikan peran pengguna telah diambil dari local storage
    const role = localStorage.getItem('role');
    setUserRole(role);

    axios.get(`http://localhost:3050/progres/status/Pending`)
      .then((response) => {
        console.log('Data App', response.data.pendingProgres);
        const Data = response.data.pendingProgres;
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
              `http://localhost:3050/progres/acc/${IDProgres}/approve`,
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
                  window.location.href = `/Approving`;
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
  

  return (
    <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

      <div className="w-[260px]"></div>

      <div className="w-[1260px]">

        <div className='h-[70px]'></div>

        <div className="w-[1200px] mx-auto mt-5">
          <div className="flex">
            <select
              name=""
              className='w-[200px] h-10 p-1 shadow-lg rounded-lg'>
              <option value="">Semua Quarter</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>



            {/* Hanya tampilkan elemen jika peran pengguna adalah "admin" */}

          </div>


          <div className="w-full mt-10">
            <div className='flex w-full h-[60px] bg-white shadow rounded-lg'>
              <span className="ml-5 my-auto w-[300px]">
                <p className="text-gray-400 font-semibold">PROGRES</p>
              </span>

              <span className="ml-5 flex my-auto w-[170px]">
                <p className="text-gray-400 font-semibold">TANGGAL</p>
              </span>

              <span className="ml-5 flex my-auto w-[280px]">
                <p className="text-gray-400 mx-auto font-semibold">ASSIGN TO</p>
              </span>

              <span className="ml-8 flex my-auto w-[90px]">
                <p className="text-gray-400 mx-auto font-semibold">CURRENT</p>
              </span>

              <span className="ml-5 flex my-auto w-[150px]">
                <p className="text-gray-400 mx-auto font-semibold">DOKUMEN</p>
              </span>
            </div>


            {dataPending ? (
              dataPending.map((Pending, index) => (
                <div key={Pending._id} className='flex w-full h-[100px] mt-5 bg-white shadow rounded-lg'>
                  <span className="ml-5 my-auto w-[300px]">
                    <p className=" font-semibold w-[300px]">{Pending.nama}</p>
                  </span>

                  <span className="ml-5 my-auto w-[170px]">
                    <div className="text-gray-400 flex font-semibold w-[170px]">
                      <p className="">{convertDateFormat(Pending.tanggal)}</p>
                    </div>
                  </span>

                  <div className="ml-5 my-auto flex w-[280px]">
                    <span className='w-[280px] flex'>
                      <img src={`http://localhost:9000/okr.profile/${Pending.foto_profile}`}
                        className='w-10 h-10 border-2 border-white rounded-[100%]' />
                      <p className="text-gray-400 ml-auto my-auto w-fit font-semibold">{Pending.nama_profile}</p>
                    </span>
                  </div>

                  <span className="ml-8 my-auto w-[90px]">
                    <div className={`h-8 w-[90px] flex my-auto rounded-xl `}>
                      <div className='w-12 rounded-xl bg-Gold h-8 flex m-auto'>
                        <p className='m-auto w-fit text-white font-semibold h-fit'>{Pending.total}</p>
                      </div>
                    </div>
                  </span>

                  <span className="ml-5 h-8 my-auto w-[150px]">
                    <div className="text-gray-400 h-8 w-[150px] flex font-semibold">
                      <span className="w-fit h-fit m-auto flex">
                        <a href={`http://localhost:9000/okr.progres/${Pending.file}`} target="_blank">
                          <div className="h-8 w-12 bg-unggu text-white flex rounded-xl">
                            <AiFillFile size={'20px'} className='w-fit h-fit m-auto' />
                          </div>
                        </a>
                        <a href={`https://${Pending.link}`} target="_blank">
                          <div className="h-8 w-12 bg-unggu text-white ml-2 flex rounded-xl">
                            <ImLink size={'20px'} className='w-fit h-fit m-auto' />
                          </div>
                        </a>
                      </span>

                    </div>
                  </span>

                  <div className='relative w-[100px] h-[100px] flex my-auto'>
                    {userRole === 'Admin' && (

                      <div className="w-fit m-auto cursor-pointer"
                        onClick={() => {
                          handleClick(Pending._id);
                          handleClickKY(Pending.id_keyresult);

                        }}>
                        <AiFillCaretRight size={'20px'} />
                      </div>
                    )}

                  </div>

                </div>
              ))
            ) : (
              <div className="mt-2 font-semibold">Belum ada data progres...</div>
            )}

          </div>

          {showApproving && (
            <div className="fixed inset-0 flex items-center justify-center z-10">
              <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
              <div className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-close mt-3 flex z-50">
                  <div className='w-[340px] h-14 my-auto ml-5 flex'>
                    <div className="flex w-14 h-14 my-auto bg-gray-100 rounded-full">
                      <span className="w-fit h-fit m-auto"><HiOutlineKey size={'30px'} /></span>
                    </div>

                    <div className="w-fit h-fit my-auto ml-2">
                      <h1 className="font-semibold text-lg ">{NamaKeyResult}</h1>
                      <p className="text-xs">Untuk : {untukey} </p>
                    </div>
                  </div>
                  <div className="close-button p-4 h-fit w-fit ml-auto cursor-pointer">
                    <div className='ml-auto w-[40px] flex h-[40px] bg-unggu  border p-1 rounded-[100%]' onClick={() => setshowApproving(false)}>
                      <p className=' w-fit h-fit text-white m-auto '>X</p>
                    </div>
                  </div>
                </div>

                <div className="modal-content py-4 text-left px-6">
                  <div className="w-full">
                    <hr />

                    {dataProgres ? (
                      <div className="w-full mt-4">
                        <h1 className="">Progres : <span className='font-semibold'><br /> {dataProgres.nama}</span></h1>

                        <p className="text-gray-600 w-full mt-5">{dataProgres.deskripsi}</p>

                        <h1 className="mt-5 font-semibold">File</h1>

                        <a href={`http://localhost:9000/okr.progres/${dataProgres.file}`} target="_blank">
                          <div className="px-3 py-3 flex bg-gray-200 mt-1 w-full h-[60px] max-h-[100px] rounded-md text-black text-base mx-auto mb-1">
                            <AiFillFile size={'30px'} className='w-fit h-fit my-auto' />
                            <div className="w-fit h-fit text-sm my-auto ml-5 max-w-[400px] ">
                              {dataProgres.file}
                            </div>
                            <div className="w-fit h-fit my-auto ml-auto">
                              <AiFillCaretRight size={'20px'} />
                            </div>
                          </div>
                        </a>

                        <h1 className="mt-5 font-semibold">Link</h1>
                        {dataProgres.link ? (
                          <a href={`http:${dataProgres.link}`} target="_blank">
                            <div className="px-3 py-3 flex bg-gray-200 mt-1 w-full h-[60px] rounded-md text-black text-base mx-auto mb-1">
                              <ImLink size={'30px'} className='w-fit h-fit my-auto' />
                              <div className=" w-[400px] my-auto overflow-auto h-10 flex ml-5">
                                <div className="w-fit h-fit text-sm ml-5 my-auto max-w-[400px] ">
                                  {dataProgres.link}
                                </div>
                              </div>
                              <div className="w-fit h-fit my-auto ml-auto">
                                <RxOpenInNewWindow size={'20px'} />
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div className="px-3 py-3 flex bg-gray-200 mt-1 w-full h-[60px]  rounded-md  text-black/90 text-base mx-auto mb-1">
                            <ImLink size={'30px'} className='w-fit h-fit my-auto' />
                            <p className="w-fit h-fit my-auto ml-5">
                              Empty
                            </p>
                          </div>
                        )}

                        <div className="px-2 py-2 flex mt-5 bg-[#00E879] w-full h-[50px]  rounded-md  text-black/90 text-base mx-auto mb-1 cursor-pointer" onClick={handleLogout}>
                          <div className="flex m-auto h-fit w-fit text-white">
                            <AiFillCheckCircle size={'30px'} className='w-fit text-white h-fit my-auto' />
                            <p className="h-fit w-fit ml-5 my-auto font-bold text-lg">Approve</p>
                          </div>
                        </div>


                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}

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
