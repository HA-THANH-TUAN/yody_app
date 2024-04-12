'use client'
import { scrollToSection } from '@/src/utils/common'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaFacebookF } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

const SignUp = () => {
 const [isEyePassword, setIsEyePassword] = useState(false)
 const [isEyeVerifyPassword, setIsEyeVerifyPassword] = useState(false)

 useEffect(() => {
  scrollToSection('start-form-register')
 }, [])
 return (
  <section
   style={{
    backgroundImage: 'url("./images/bg_login.webp")'
   }}
   className='min-h-screen bg-cover bg-no-repeat py-9'
  >
   <div className='flex justify-center h-full items-center'>
    <div className='w-full'>
     <section
      id='start-form-register'
      className='max-w-xl mx-auto min-h-80 py-10 bg-white rounded-sm'
     >
      <h4 className='mb-8 text-center text-zinc-800'>
       Chào mừng bạn đến với Yody!
      </h4>
      <div>
       <h3 className='text-2xl font-medium text-center'>
        <span className='text-blue-700 mr-2'>ĐĂNG</span>
        <span className='text-orangeCt'>KÍ</span>
       </h3>
       <div className='mx-auto px-16'>
        <form className=''>
         <div className='mt-6'>
          <input
           className='border-zinc-300 border border-solid w-full text-sm rounded px-3 py-3'
           type='text'
           placeholder='Họ và tên'
          />
         </div>
         <div className='mt-6'>
          <input
           className='border-zinc-300 border border-solid w-full text-sm rounded px-3 py-3'
           type='text'
           placeholder='Email'
          />
         </div>
         <div className='mt-6'>
          <input
           className='border-zinc-300 border border-solid w-full text-sm rounded px-3 py-3'
           type='text'
           placeholder='Số điện thoại'
          />
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
         <div className='mt-6'>
          <button className='bg-orangeCt text-white py-2 text-center w-full rounded font-medium text-[18px]'>
           Đăng nhập
          </button>
         </div>
        </form>
        <div className='mt-8'>
         <p className='before:absolute before:w-full before:h-[0.5px] mb-7 before:bg-zinc-300 before:top-[50%] text-black  relative flex justify-center '>
          <span className='relative z-30 inline-block px-2 bg-white text-sm'>
           Hoặc đăng kí bằng
          </span>
         </p>
         <ul className='flex justify-center'>
          <li className='hover:bg-zinc-50 hover:cursor-pointer border border-zinc-200 w-32 flex items-center mx-4 rounded-[20px]'>
           <span className='w-10 h-10 mr-1 rounded-[50%] inline-flex justify-center items-center text-2xl'>
            <FcGoogle />
           </span>
           <span className='text-sm font-medium'>Google</span>
          </li>
          <li className='hover:bg-zinc-50 hover:cursor-pointer border border-zinc-200 w-32 flex items-center mx-4 rounded-[20px]'>
           <span className='w-10 h-10 text-blue-700 mr-1 rounded-[50%] inline-flex justify-center items-center text-xl'>
            <FaFacebookF />
           </span>
           <span className='text-sm font-medium'>Facebook</span>
          </li>
         </ul>
         <div className='flex justify-center mt-8'>
          <span className='mr-1 text-zinc-600'>Bạn đã có tài khoản? </span>
          <Link
           href={{ pathname: '/sign-in' }}
           scroll={true}
          >
           <span className='text-orangeCt font-medium hover:opacity-85 cursor-pointer '>
            Đăng nhập ngay!
           </span>
          </Link>
         </div>
        </div>
       </div>
      </div>
     </section>
    </div>
   </div>
  </section>
 )
}

export default SignUp
