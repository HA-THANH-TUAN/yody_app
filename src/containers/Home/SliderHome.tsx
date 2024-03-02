'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function SliderHome() {
 return (
  <div className='pt-[31.25%] relative'>
   <div className='absolute top-0 right-0 left-0 bottom-0 overflow-hidden'>
    <Swiper
     modules={[Navigation, Pagination, Scrollbar, A11y]}
     pagination={{ clickable: true }}
    >
     <SwiperSlide>
      <Image
       src='/images/slider_1.webp'
       alt=''
       quality={100}
       width={2000}
       height={1000}
       style={{ width: '100%', height: '100%' }}
      />
     </SwiperSlide>
     <SwiperSlide>
      <Image
       src='/images/slider_1.webp'
       alt=''
       quality={100}
       width={2000}
       height={1000}
       style={{ width: '100%', height: '100%' }}
      />
     </SwiperSlide>
     <SwiperSlide>
      <Image
       src='/images/slider_1.webp'
       alt=''
       quality={100}
       width={2000}
       height={1000}
       style={{ width: '100%', height: '100%' }}
      />
     </SwiperSlide>
     <SwiperSlide>
      <Image
       src='/images/slider_1.webp'
       alt=''
       quality={100}
       width={2000}
       height={1000}
       style={{ width: '100%', height: '100%' }}
      />
     </SwiperSlide>
    </Swiper>
   </div>
  </div>
 )
}
