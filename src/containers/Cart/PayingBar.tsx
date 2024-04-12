import React from 'react'
import { AiFillSecurityScan } from 'react-icons/ai'
import { GoShieldCheck } from 'react-icons/go'
import { LiaCcAmazonPay, LiaClock } from 'react-icons/lia'
import { TbArrowsExchange } from 'react-icons/tb'

const PayingBar = () => {
 return (
  <div>
   <p className='font-medium mb-3 flex justify-between'>
    Tổng đơn hàng ( tạm tính ) <span className='font-semibold'>897.000đ</span>
   </p>
   <button className='font-semibold w-full rounded flex justify-center items-center px-5 py-1 text-white bg-orangeCt'>
    <span className='text-3xl'>
     <LiaCcAmazonPay />
    </span>
    Thanh Toán Ngay
   </button>
   <ul className='mt-10'>
    <li className='flex items-center'>
     <span className='w-8 h-8 mr-2 text-zinc-500 text-2xl flex justify-center items-center'>
      <GoShieldCheck />
     </span>
     <p className='text-zinc-800 flex-1'>Thông tin bảo mật và mã hóa</p>
    </li>
    <li className='flex items-center'>
     <span className='w-8 h-8 mr-2 text-zinc-500 text-[28px] flex justify-center items-center'>
      <LiaClock />
     </span>
     <p className='text-zinc-800 flex-1'>
      <span className='text-black font-bold'>Giao hàng : </span>Từ 1 - 3 ngày
     </p>
    </li>
    <li className='flex items-center'>
     <span className='w-8 h-8 mr-2 text-zinc-500 text-2xl flex justify-center items-center'>
      <TbArrowsExchange />
     </span>

     <p className='text-zinc-800 flex-1'>
      <span className='text-black font-bold'>Miễn phí đổi trả : </span> tại 250+
      cửa hàng trong 15 ngày ngày
     </p>
    </li>
   </ul>
  </div>
 )
}

export default PayingBar
