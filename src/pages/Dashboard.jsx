import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import Chart from 'chart.js/auto';



import { BsFillPersonCheckFill, BsCheckLg, BsLink45Deg, BsThreeDotsVertical, BsFillBellFill } from "react-icons/bs";
import { HiMiniChartBarSquare, HiDocumentText, HiOutlineDocumentText } from "react-icons/hi2";


export const Dashboard = () => {

  const [dataProjek, setdataProjek] = useState(null); // Menambahkan state data
  const [datatim, setdatatim] = useState(null); // Menambahkan state data
  const [Alldatatim, setAlldatatim] = useState(null); // Menambahkan state data
  const [LastProgres, setLastProgres] = useState(null); // Menambahkan state data
  const [persentage, setPersentage] = useState(0);
  const [IDRofile, setIDRofile] = useState(0);
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    // Pastikan peran pengguna telah diambil dari local storage
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Cek apakah token tersimpan di Local Storage
    const token = localStorage.getItem('token');
    if (token) {
      // todo console.log('Token ditemukan:', token);
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
          console.log('Respon dari server (Berhasil mendapatkan profile):', data._id);

          setIDRofile(data._id);

        })
        .catch(error => {
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

  useEffect(() => {
    axios.get(`http://localhost:3050/progres/dataprogres/approved/${IDRofile}`)
      .then((response) => {
        // Mengisi opsi kategori dengan data dari server
        console.log('ID Profile', response.data);
        setLastProgres(response.data)

        // setAlldatatim(response.data.profileData);
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });
  }, [IDRofile]);

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

  function getGrade(score) {
    if (score >= 0 && score <= 50) {
      return 'Kurang';
    } else if (score >= 51 && score <= 79) {
      return 'Stabil';
    } else if (score >= 80 && score <= 100) {
      return 'Baik';
    } else {
      return 'Tidak Valid'; // Untuk menangani nilai di luar rentang
    }
  }
  function getGradeColorClass(score) {
    if (score >= 0 && score <= 50) {
      return 'bg-Merah';
    } else if (score >= 51 && score <= 79) {
      return 'bg-Kuning';
    } else if (score >= 80 && score <= 100) {
      return 'bg-Hijau';
    } else {
      return ''; // Tidak ada kelas jika nilai tidak valid
    }
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

  let myChart = null; // Deklarasikan objek myChart di luar useEffect


  useEffect(() => {
    // Menghancurkan grafik yang sudah ada (jika ada)
    if (myChart) {
      myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'line', // Ubah tipe grafik menjadi 'line'
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Objektif',
            data: [10, 20, 10, 30],
            borderColor: 'blue', // Warna garis
            borderWidth: 2, // Lebar garis
            fill: false, // Tidak mengisi area di bawah garis
            tension: 0.4, // Set tension to control the interpolation mode (0 for 'linear', 0.4 for 'smooth')

          },
          {
            label: 'Keyresult Progres',
            data: [10, 22, 5],
            borderColor: 'RED', // Warna garis
            borderWidth: 2, // Lebar garis
            fill: false, // Tidak mengisi area di bawah garis
            tension: 0.4, // Set tension to control the interpolation mode (0 for 'linear', 0.4 for 'smooth')

          },
          {
            label: 'Keyresult Completed',
            data: [10, 55, 40],
            borderColor: 'blue', // Warna garis
            borderWidth: 2, // Lebar garis
            fill: false, // Tidak mengisi area di bawah garis
            tension: 0.4, // Set tension to control the interpolation mode (0 for 'linear', 0.4 for 'smooth')

          },
        ],
      },
      options: {
        scales: {
          x: {
            position: 'bottom', // Menempatkan label sumbu X di bawah grafik
          },
          y: {
            beginAtZero: true,
          },
        },
        
      },
    });
  }, []);
 




  return (
    <div className='flex w-full bg-gray-100/60 h-fit font-Poppins'>

      <div className="w-[260px]"></div>

      <div className="w-[1260px] mx-auto">
        <div className='h-[70px]'></div>

        <div className="w-[1200px] mx-auto mt-5">
          <div className="w-full flex mx-auto">
            <div className="w-[700px] bg-white rounded-lg p-5 mt-[20px]">
              <h1 className="font-semibold text-xl mb-2">Laporan Data</h1>
              <h1 className="font-normal text-sm">Progress Summery</h1>

              <div className="flex mt-10">
                <div className="w-[150px] h-[150px] bg-Merah-muda rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-Merah ml-3 mt-3 flex">
                    <div className="text-white m-auto w-fit h-fit"><HiMiniChartBarSquare size={'20px'} /></div>
                  </div>
                  <h1 className="text-2xl font-semibold ml-3 mt-5">5</h1>
                  <h1 className="text-sm font-normal ml-3 mt-4">Projek</h1>
                </div>

                <div className="w-[150px] h-[150px] bg-cream rounded-xl ml-5">
                  <div className="w-7 h-7 rounded-full bg-cream-Dark ml-3 mt-3 flex">
                    <div className="text-white m-auto w-fit h-fit"><HiDocumentText size={'20px'} /></div>
                  </div>
                  <h1 className="text-2xl font-semibold ml-3 mt-5">2</h1>
                  <h1 className="text-sm font-normal ml-3 mt-4">Objective Active</h1>
                </div>

                <div className="w-[150px] h-[150px] bg-Hijau-muda rounded-xl ml-5">
                  <div className="w-7 h-7 rounded-full bg-Hijau-tua ml-3 mt-3 flex">
                    <div className="text-white m-auto w-fit h-fit"><BsCheckLg size={'20px'} /></div>
                  </div>
                  <h1 className="text-2xl font-semibold ml-3 mt-5">10</h1>
                  <h1 className="text-sm font-normal ml-3 mt-4">Key Result</h1>
                </div>

                <div className="w-[150px] h-[150px] bg-unggu-muda rounded-xl ml-5">
                  <div className="w-7 h-7 rounded-full bg-unggu-tua ml-3 mt-3 flex">
                    <div className="text-white m-auto w-fit h-fit"><BsFillPersonCheckFill size={'15px'} /></div>
                  </div>
                  <h1 className="text-2xl font-semibold ml-3 mt-5">1</h1>
                  <h1 className="text-sm font-normal ml-3 mt-4">Objective Done</h1>
                </div>
              </div>
            </div>

            <div className="w-[470px] ml-auto mt-[20px] rounded-lg p-5 bg-white">
              {/* Blog diagram chart */}
              <canvas id="myChart"></canvas>

            </div>
          </div>


          <div className="w-full flex mx-auto">
            <div className="w-[850px] bg-white rounded-lg p-5 mt-[20px]">
              <h1 className="font-semibold text-2xl mb-2">Semua Projek</h1>

              <div className="w-full mt-6">
                <div className='flex w-full h-[60px] bg-white rounded-lg'>
                  <div className="ml-5 my-auto min-w-[200px]">
                    <p className="text-gray-400 w-fit font-semibold text-xs">PROJEK</p>
                  </div>

                  <div className="ml-5 my-auto w-[170px]">
                    <p className="text-gray-400 w-fit font-semibold text-xs">ANGGOTA</p>
                  </div>

                  <div className="ml-8 my-auto w-[135px]">
                    <p className="text-gray-400 w-fit font-semibold text-xs">STATUS</p>
                  </div>

                  <div className="ml-5 my-auto w-[280px]">
                    <p className="text-gray-400 w-fit font-semibold text-xs">PENYELESAIAN</p>
                  </div>
                </div>

                <div className="overflow-y-scroll w-full h-[280px]">
                  <div className="w-full h-fit ">
                    {dataProjek ? (
                      dataProjek.map((Projek, index) => (
                        <div key={Projek._id} className='flex w-full h-[70px] bg-white border-t rounded-lg'>
                          <NavLink to={`/Objective/${Projek._id}`} className='flex w-full h-[70px] rounded-lg'>
                            <div className="ml-5 my-auto min-w-[200px]">
                              <p className=" font-semibold w-fit text-xs">{Projek.nama}</p>
                            </div>

                            <div className="ml-5 my-auto w-[170px]">
                              <div className="text-gray-400 flex font-semibold">
                                {Projek.team.slice(0, 4).map((tim, index) => (
                                  <div className="flex -mr-5" key={tim}>
                                    <img className='w-8 h-8 border-2 border-white rounded-[100%]' src={getTimName(tim)} alt="" />
                                  </div>
                                ))}
                                {Projek.team.length > 4 && (
                                  <div className="-ml-1 my-auto flex rounded-[100%] bg-unggu-tua text-white w-8 h-8 ">
                                    <p className="w-fit h-fit m-auto ">
                                      +{Projek.team.length - 4}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="ml-8 my-auto w-[135px]">
                              <div className={`h-7 w-20 flex my-auto rounded-xl ${Projek.status == "Progress" ? "bg-Gold" : Projek.status === "Selesai" ? "bg-Hijau-tua" : "bg-Gold"}`}>
                                <p className='m-auto w-fit text-white font-semibold h-fit text-xs'>{Projek.status}</p>
                              </div>
                            </div>

                            <div className="ml-5 my-auto w-[280px]">
                              <div className="text-gray-400 font-semibold text-xs">
                                <h1 className={`${percentages[index] === '100' ? "text-Hijau-tua " : "text-Gold"}`}>{percentages[index] || 0}%</h1>
                                <div className='w-[200px] h-2 bg-gray-300 rounded-2xl'>
                                  <div className={`h-2 rounded-2xl  ${percentages[index] === '100' ? "bg-Hijau-tua" : "bg-Gold"}`} style={{ width: `${percentages[index] || 0}%` }}></div>
                                </div>
                              </div>
                            </div>

                          </NavLink>
                        </div>
                      ))
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>

                </div>

              </div>


            </div>



            <div className="w-[320px] ml-auto bg-white rounded-lg p-5 mt-[20px]">
              {/* Blok user */}

              {userRole === 'Admin' || userRole === 'Menejemen' ? (
                <div className="w-full">

                  <h1 className="font-semibold text-2xl mb-8">Performa Pekerja</h1>
                  <div className="overflow-y-scroll w-full h-[350px] mt-3">
                    <div className="w-full h-fit">
                      {Alldatatim ? (
                        Alldatatim.map((Tim) => (

                          <div key={Tim._id} className="h-16 flex">
                            <img src={`http://localhost:9000/okr.profile/${Tim.foto}`} className='w-12 h-12 my-auto rounded-full' />
                            <div className="my-auto ml-3 w-[100px]">
                              <p className='font-semibold w-fit text-xs'>{Tim.nama}</p>
                              <p className='font-light text-gray-500 text-xs'>{Tim.divisi}</p>
                            </div>

                            <div className={`h-7 flex m-auto w-14 rounded-xl text-white ${getGradeColorClass(Tim.grade)}`}>
                              <p className='font-semibold h-fit m-auto w-fit text-xs'>{getGrade(Tim.grade)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Loading...</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Kode yang ingin ditampilkan jika peran bukan admin
                <div className="w-full">
                  <h1 className="font-semibold text-2xl mb-8">Progres Terakhir</h1>
                  <div className="overflow-y-scroll w-full h-[350px] mt-3">
                    <div className="w-full h-fit">
                      {LastProgres ? (
                        LastProgres.map((Progres) => (
                          <div key={Progres._id} className="h-20 flex">
                            <div className="">
                              <BsFillBellFill size={'20px'} className='mb-2 text-unggu' />
                              <div className="w-1 h-12 bg-gray-300 mx-auto rounded-xl"></div>
                            </div>
                            <div className="w-full ml-2">
                              <h1 className="font-semibold text-sm">{Progres.nama}</h1>
                              <h1 className="text-gray-500 font-semibold text-sm">{convertDateFormat(Progres.tanggal)}</h1>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Loading...</div>
                      )}

                    </div>
                  </div>

                </div>
              )}


            </div>
          </div>
        </div>

        <div className='h-[10px] mt-5'></div>


      </div>
    </div>
  )
}
