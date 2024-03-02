'use client'
import ProductCart from '@/src/components/ProductCart'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { GrNext, GrPrevious } from 'react-icons/gr'
import Image from 'next/image'
import React, { useRef } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, FreeMode, Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'

export default function ProductListBlock() {
 const swiper = useRef<SwiperRef>(null)
 const onPreviousCard = () => {
  if (swiper.current) {
   console.log(swiper.current.swiper.slidePrev())
  }
 }
 const onNextCard = () => {
  if (swiper.current) {
   console.log(swiper.current.swiper.slideNext())
  }
 }
 return (
  <section className='mt-8 mb-8'>
   <section>
    <div className='flex justify-between py-5 pr-8'>
     <div className='text-textBlueCt font-medium'>
      YODY SPORT - Thoải mái vận động
     </div>
     <p className='font-medium text-zinc-600 hover:opacity-80 cursor-pointer'>
      Xem thêm
     </p>
    </div>
   </section>
   <section className='grid grid-cols-6 gap-x-4'>
    <div className='col-span-1'>
     <Image
      src='/images/banner-side.webp'
      width={285}
      height={624}
      quality={100}
      style={{ objectFit: 'contain' }}
      alt=''
     />
    </div>
    <div className='col-span-5 px-9'>
     <section className='relative'>
      <button
       onClick={onNextCard}
       className='w-8 h-8 top-[calc(50%-16px)] -right-9 absolute z-[1800]  text-white text-md flex justify-center items-center rounded-[50%] bg-[#0000005f]'
      >
       <GrNext />
      </button>
      <button
       onClick={onPreviousCard}
       className='w-8 h-8 top-[calc(50%-16px)] -left-9 absolute z-[1800]  text-white text-md flex justify-center items-center rounded-[50%] bg-[#0000005f]'
      >
       <GrPrevious />
      </button>
      <Swiper
       ref={swiper}
       modules={[Navigation, Autoplay, FreeMode]}
       pagination={{ clickable: true }}
       spaceBetween={20}
       onSlideChange={() => console.log('slide change')}
       enabled={true}
       //    slidesPerGroupSkip={4}
       slidesPerGroup={4}
       freeMode={{
        enabled: false
       }}
       slidesPerView={4}
       setWrapperSize={true}
       initialSlide={4}
       navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
       }}
      >
       {[...Array(10)].map((p, i) => (
        <SwiperSlide key={i}>
         <ProductCart index={i} />
        </SwiperSlide>
       ))}
      </Swiper>
     </section>
    </div>
   </section>
  </section>
 )
}
