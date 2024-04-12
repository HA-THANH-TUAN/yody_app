import React from 'react'

const AccountSection = () => {
 return (
  <>
   <div className='flex justify-between items-center h-16 px-6'>
    <span className='text-orangeCt font-semibold'>Thông tin cá nhân</span>
    <button className='bg-orangeCt font-semibold text-white rounded py-2 w-44 '>
     Sửa thông tin
    </button>
   </div>
   <hr />
   <div className='px-6 py-4'>
    <ul className='grid grid-cols-2 gap-y-4'>
     <li className='col-span-1 text-sm'>
      <span className='mr-1 font-medium'>Họ và tên :</span>
      <span>Ha Thanh Tuan</span>
     </li>
     <li className='col-span-1 text-sm'>
      <span className='mr-1 font-medium'>Email :</span>
      <span>s2hathanhtuan2s@gmail.com</span>
     </li>
     <li className='col-span-1 text-sm'>
      <span className='mr-1 font-medium'>Số điện thoại :</span>
      <span>0363319793</span>
     </li>
     <li className='col-span-1 text-sm'>
      <span className='mr-1 font-medium'>Địa chỉ :</span>
      <span>Hồ Chí Minh, Việt Nam</span>
     </li>
    </ul>
   </div>
  </>
 )
}

export default AccountSection
