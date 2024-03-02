import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import clsx from 'clsx'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { StarAttachProduct } from './StarAttachProduct'
import SaleAttachProduct from './SaleAttachProduct'

type ProductCart = {
 index: number
}

export default function ProductCart({ index }: ProductCart) {
 const swiper = useRef<SwiperRef>(null)
 //  const [indexColorProduct, setindexColorProduct] = useState();
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
  <div className='w-full'>
   <figure className='pt-[136%] relative'>
    <StarAttachProduct />
    <SaleAttachProduct />
    <div className='absolute rounded overflow-hidden top-0 left-0 right-0'>
     <Image
      src='/images/ao-so-mi-nu.webp'
      alt=''
      width={220}
      height={394}
      style={{ width: '100%', objectFit: 'contain' }}
      className='hover:scale-105 transition-transform block'
     />
    </div>
   </figure>
   <p className='text-sm font-medium'>Áo Polo Thể Thao {index}</p>
   <p>
    <span className='text-red-700 text-sm font-semibold'>134.500đ</span>
    <span className='text-zinc-500 text-sm line-through font-semibold ml-4'>
     269.000đ
    </span>
   </p>
   <div className={clsx('relative', index + 1 > 6 ? 'pr-11' : '')}>
    <button
     onClick={onNextCard}
     className={clsx(
      'w-5 h-5 top-[calc(50%-10px)] right-2 absolute z-[1800]  text-white text-sm flex justify-center items-center rounded-[50%] bg-[#0000005f]',
      index + 1 > 6 ? '' : 'hidden'
     )}
    >
     <GrNext />
    </button>
    {/* <button
     onClick={onPreviousCard}
     className={clsx(
      'w-5 h-5 top-[calc(50%-10px)] absolute z-[1800]  text-white text-sm flex justify-center items-center rounded-[50%] bg-[#0000005f]',
      index + 1 > 6 ? '' : 'hidden'
     )}
    >
     <GrPrevious />
    </button> */}
    <Swiper
     ref={swiper}
     slidesPerView={index + 1 > 6 ? 5 : 6}
     spaceBetween={3}
    >
     {[...Array(index + 1)].map((r, i) => (
      <SwiperSlide key={i}>
       <p
        style={{
         backgroundSize: '30px',
         backgroundPositionY: '-12px'
        }}
        className='w-7 h-7 rounded-[50%] bg-[url("/images/ao-so-mi-nu.webp")] bg-no-repeat'
       ></p>
      </SwiperSlide>
     ))}
    </Swiper>
   </div>
  </div>
 )
}
