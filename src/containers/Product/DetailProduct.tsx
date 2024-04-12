'use client'
import Image from 'next/image'
import { HiMiniStar } from 'react-icons/hi2'
import React from 'react'
const DetailProduct = () => {
 return (
  <section className='max-w-7xl mx-auto'>
   <p className='py-6 text-sm'>
    <span>Quần jean nữ</span> /{' '}
    <span className='font-medium'>Quần Jeans Nữ Skinny Lưng Cao Hack Dáng</span>
   </p>
   <section className='grid grid-cols-3 gap-8'>
    <div className='col-span-2'>
     <ul className='grid grid-cols-2 gap-4'>
      <li className='col-span-1 overflow-hidden rounded-md'>
       <Image
        src='/images/ao-so-mi-nu.webp'
        alt=''
        // fill={true}
        width={400}
        height={535}
        sizes='100%'
        quality={100}
        style={{
         width: '100%',
         objectFit: 'contain'
        }}
       />
      </li>
      <li className='col-span-1 overflow-hidden rounded-md'>
       <Image
        src='/images/ao-so-mi-nu.webp'
        alt=''
        // fill={true}
        width={400}
        height={535}
        sizes='100%'
        quality={100}
        style={{
         width: '100%',
         objectFit: 'contain'
        }}
       />
      </li>
      <li className='col-span-1 overflow-hidden rounded-md'>
       <Image
        src='/images/ao-so-mi-nu.webp'
        alt=''
        // fill={true}
        width={400}
        height={535}
        sizes='100%'
        quality={100}
        style={{
         width: '100%',
         objectFit: 'contain'
        }}
       />
      </li>
      <li className='col-span-1 overflow-hidden rounded-md'>
       <Image
        src='/images/ao-so-mi-nu.webp'
        alt=''
        // fill={true}
        width={400}
        height={535}
        sizes='100%'
        quality={100}
        style={{
         width: '100%',
         objectFit: 'contain'
        }}
       />
      </li>
     </ul>
    </div>
    <div className='col-span-1'>
     {/* main-detail */}
     <section>
      <div>
       <h3 className='text-xl font-medium mb-2'>
        Quần Jeans Nữ Skinny Lưng Cao Hack Dáng
       </h3>
       <div className='flex text-sm mb-2'>
        <p className='mr-2'>QJN5068-XDM</p>
        <p className='mr-2'>Đã bán 7.2K</p>
        <div className='flex items-center'>
         <ul className='flex text-yellow-400'>
          <li>
           <HiMiniStar />
          </li>
          <li>
           <HiMiniStar />
          </li>
          <li>
           <HiMiniStar />
          </li>
          <li>
           <HiMiniStar />
          </li>
          <li>
           <HiMiniStar />
          </li>
         </ul>
         <span className='ml-1'>(7)</span>
        </div>
       </div>
      </div>
      <p className='flex items-center mb-2'>
       <span className='text-3xl text-red-700 font-bold'>249.500đ </span>
       <span className='text-xl text-zinc-300 font-medium ml-4 line-through'>
        499.000đ
       </span>
      </p>
      <p className='flex items-center'>
       <span className='text-sm '>Giảm tận: 249.500đ</span>
       <span className='rounded py-[3px] px-1 inline-block text-sm leading-none ml-3 bg-orangeCt font-bold'>
        - 50%
       </span>
      </p>
     </section>
    </div>
   </section>
  </section>
 )
}

export default DetailProduct
