'use client'
import Image from 'next/image'
import React from 'react'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper/modules'

export default function CategoryHome() {
 return (
  <div className='mt-10'>
   <section className=''>
    <div className='max-w-2xl mx-auto'>
     <ul className='grid grid-cols-3 gap-x-10'>
      <li>
       <p className='pt-6 px-3 pb-3 text-center border-b-2 font-medium hover:text-orangeCt cursor-pointer transition-colors duration-150 hover:border-orangeCt'>
        NỮ
       </p>
      </li>
      <li>
       <p className='pt-6 px-3 pb-3 text-center border-b-2 font-medium hover:text-orangeCt cursor-pointer transition-colors duration-150 hover:border-orangeCt'>
        NAM
       </p>
      </li>
      <li>
       <p className='pt-6 px-3 pb-3 text-center border-b-2 font-medium hover:text-orangeCt cursor-pointer transition-colors duration-150 hover:border-orangeCt'>
        TRẺ EM
       </p>
      </li>
     </ul>
    </div>
    <div></div>
   </section>
   <section className='mt-6 max-h-44 overflow-hidden'>
    <Swiper
     modules={[Navigation, Thumbs, Pagination, Scrollbar, A11y]}
     slidesPerView={8}
    >
     {[...Array(20)].map((v, index) => (
      <SwiperSlide key={index}>
       <div className='text-textBlueCt hover:text-orangeCt transition-all hover:cursor-pointer hover:-translate-y-2'>
        <div className='px-8 pt-6 pb-3'>
         <Image
          src='/images/icon-category.webp'
          alt=''
          quality={100}
          width={150}
          height={150}
          style={{ width: '100%', objectFit: 'contain' }}
         />
        </div>
        <p className='text-center font-medium mb-2'>AO KHOAC NU</p>
       </div>
      </SwiperSlide>
     ))}
    </Swiper>
   </section>
  </div>
 )
}
