import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import FormEditAddress from './FormEditAddress/FormEditAddress'

const ListAddressSection = () => {
 const [isOpenFormEditAddress, setIsOpenFormEditAddress] =
  useState<boolean>(false)
 return (
  <>
   {isOpenFormEditAddress && (
    <FormEditAddress
     onCancel={() => {
      setIsOpenFormEditAddress(false)
     }}
    />
   )}
   <div className='flex justify-between items-center h-16 px-6'>
    <span className='text-orangeCt font-semibold'>Địa chỉ của bạn</span>
    <button
     className='bg-orangeCt font-semibold hover:opacity-75 text-white rounded py-2 w-44 '
     onClick={() => {
      setIsOpenFormEditAddress(true)
     }}
    >
     + Thêm địa chỉ mới
    </button>
   </div>
   <hr />
   <div className='px-6 py-4'>
    <ul className=''>
     {[...Array(6)].map(() => (
      <>
       <li className='text-sm mb-2 flex'>
        <ul className='flex-1'>
         <li className='flex mb-2'>
          <span className='block w-28 text-zinc-400 font-medium'>
           Họ và tên :
          </span>
          <span className='flex flex-1'>
           Hà Thanh Tuấn
           <span className='text-green-800 font-medium ml-4 flex items-center text-xs'>
            <span className='mr-1'>
             <FaCheckCircle />
            </span>
            Địa chỉ mặc định
           </span>
          </span>
         </li>
         <li className='flex mb-2'>
          <span className='block w-28 text-zinc-400 font-medium'>
           Số điện thoại :
          </span>
          <span className='block flex-1'>0363319792</span>
         </li>
         <li className='flex mb-2'>
          <span className='block w-28 text-zinc-400 font-medium'>
           Địa chỉ :
          </span>
          <span className='block flex-1'>
           Ho Chi Minh, Phường Linh Trung, Quận Thủ Đức, TP Hồ Chí Minh, Vietnam
          </span>
         </li>
        </ul>
        <div className='font-medium flex flex-col w-8'>
         <button className='text-zinc-400 underline mb-1'>Sửa</button>
         <button className='text-orangeCt'>Xóa</button>
        </div>
       </li>
       <hr className='mb-4' />
      </>
     ))}
    </ul>
   </div>
  </>
 )
}

export default ListAddressSection
