import Image from 'next/image'
import React, { FC } from 'react'
import { MdAdd, MdDeleteForever } from 'react-icons/md'
import { RiSubtractLine } from 'react-icons/ri'

interface ICartItem {}

const CartItem: FC<ICartItem> = ({}) => {
 return (
  <li className='mt-5'>
   <div className='font-medium text-sm flex flex-wrap'>
    <span className='w-full sm:w-1/2'>
     <div className='flex'>
      <div className='mr-3'>
       <figure className='rounded-sm max-w-[90px] overflow-hidden'>
        <Image
         height='120'
         width='90'
         src='/images/ao-so-mi-nu.webp'
         alt=''
         className='w-full object-contain'
        />
       </figure>
      </div>
      <div className='flex-1'>
       <div className=' flex flex-col justify-between h-full font-normal text-zinc-800'>
        <p className='font-medium text-zinc-700'>
         Áo Polo Nữ Airycool Thoáng Mát Phối Bo Áo Polo Nữ Airycool Thoáng Mát
         Phối Bo
        </p>
        <span className='sm:hidden inline-block pt-2 text-base font-semibold'>
         Giá : 300.000đ
        </span>
        <span className='mb-1 font-semibold flex justify-between'>
         <span className='flex items-end sm:block'>Xanh / M</span>
         <button className='w-6 h-6 text-zinc-600 hover:opacity-85 cursor-pointer sm:hidden text-2xl flex justify-center items-center'>
          <MdDeleteForever />
         </button>
        </span>
       </div>
      </div>
     </div>
    </span>
    <span className='hidden sm:block w-[15%] text-center'>300.000đ</span>
    <span className='hidden sm:flex w-[20%] justify-center'>
     <div className='flex'>
      <span className='w-7 lg:w-9 text-lg hover:opacity-75 cursor-pointer border rounded-l border-solid border-zinc-300 text-zinc-700 h-7 lg:h-9 flex justify-center items-center'>
       <RiSubtractLine />
      </span>
      <input
       className='w-10 lg:w-12 border-t border-b border-r-0 border-l-0 border-solid border-zinc-300 text-zinc-700 h-7 lg:h-9 text-center flex justify-center items-center'
       value={'1'}
      />
      <span className='w-7 lg:w-9 text-lg hover:opacity-75 cursor-pointer border rounded-r border-solid border-zinc-300 text-zinc-700 h-7 lg:h-9 flex justify-center items-center'>
       <MdAdd />
      </span>
     </div>
    </span>
    <span className='hidden sm:block w-[15%] relative text-right'>
     300.000đ
     <button className='absolute bottom-0 flex justify-center items-center right-0 w-6 h-6 text-2xl text-zinc-600 hover:opacity-85 cursor-pointer'>
      <MdDeleteForever />
     </button>
    </span>
   </div>
   <div className='flex items-center justify-between mt-3'>
    <div className='flex'>
     <span className='w-8 text-lg hover:opacity-75 cursor-pointer border rounded-l border-solid border-zinc-300 text-zinc-700 h-8 flex justify-center items-center'>
      <RiSubtractLine />
     </span>
     <input
      className='w-11 border-t border-b border-r-0 border-l-0 border-solid border-zinc-300 text-zinc-700 h-8 text-center flex justify-center items-center'
      value={'1'}
     />
     <span className='w-8 text-lg hover:opacity-75 cursor-pointer border rounded-r border-solid border-zinc-300 text-zinc-700 h-8 flex justify-center items-center'>
      <MdAdd />
     </span>
    </div>
    <p className='font-bold'>
     Tổng : <span className='font-bold'>623.000đ</span>
    </p>
   </div>
   <hr className='mt-3' />
  </li>
 )
}

export default CartItem
