import React, { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

const ChangePasswordSection = () => {
 const [isEyePasswordPresent, setIsEyePasswordPresent] = useState(false)
 const [isEyePassword, setIsEyePassword] = useState(false)
 const [isEyeVerifyPassword, setIsEyeVerifyPassword] = useState(false)
 return (
  <>
   <div className='flex items-center justify-center text-sm text-zinc-500 h-16 px-6'>
    <span className='text-orangeCt text-base font-semibold mr-1'>
     Đổi mật khẩu
    </span>
    ( Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác )
   </div>
   <hr />
   <div className=''>
    <form className='max-w-lg mx-auto'>
     <div className='mt-6 relative'>
      <input
       className='border-zinc-300 border border-solid w-full text-sm rounded pl-3 pr-10 py-3'
       placeholder='Mật khẩu hiện tại'
       type={isEyePasswordPresent ? 'text' : 'password'}
      />
      {isEyePasswordPresent ? (
       <span
        onClick={() => {
         setIsEyePasswordPresent((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOutline />
       </span>
      ) : (
       <span
        onClick={() => {
         setIsEyePasswordPresent((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOffOutline />
       </span>
      )}
     </div>
     <div className='mt-6 relative'>
      <input
       className='border-zinc-300 border border-solid w-full text-sm rounded pl-3 pr-10 py-3'
       placeholder='Mật khẩu'
       type={isEyePassword ? 'text' : 'password'}
      />
      {isEyePassword ? (
       <span
        onClick={() => {
         setIsEyePassword((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOutline />
       </span>
      ) : (
       <span
        onClick={() => {
         setIsEyePassword((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOffOutline />
       </span>
      )}
     </div>
     <div className='mt-6 relative'>
      <input
       className='border-zinc-300 border border-solid w-full text-sm rounded pl-3 pr-10 py-3'
       placeholder='Xác mật khẩu'
       type={isEyeVerifyPassword ? 'text' : 'password'}
      />
      {isEyeVerifyPassword ? (
       <span
        onClick={() => {
         setIsEyeVerifyPassword((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOutline />
       </span>
      ) : (
       <span
        onClick={() => {
         setIsEyeVerifyPassword((state) => !state)
        }}
        className='top-[calc(50%-12px)] hover:text-zinc-600 hover:cursor-pointer right-0 pr-3 absolute h-6 text-xl flex justify-center items-center '
       >
        <IoEyeOffOutline />
       </span>
      )}
     </div>
     <div className='mt-6 flex justify-center'>
      <button
       type='button'
       className=' bg-orangeCt text-white py-2 text-center w-[50%] rounded font-medium text-[18px]'
      >
       Lưu
      </button>
     </div>
    </form>
   </div>
  </>
 )
}

export default ChangePasswordSection
