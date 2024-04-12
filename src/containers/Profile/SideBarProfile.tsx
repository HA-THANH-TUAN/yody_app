'use client'
import { ITabProfile } from '@/app/profile/page'
import clsx from 'clsx'
import React, { FC } from 'react'
import { LiaUserSolid } from 'react-icons/lia'
import { PiMapPinLine, PiUserBold } from 'react-icons/pi'
import { RxFileText } from 'react-icons/rx'
import { TbLockCog } from 'react-icons/tb'

interface ISideBarProfile {
 tabName: ITabProfile['tabName']
 setTab: React.Dispatch<React.SetStateAction<ITabProfile['tabName']>>
}
const SideBarProfile: FC<ISideBarProfile> = ({ tabName, setTab }) => {
 return (
  <div className='col-span-1 bg-white min-h-[600px]'>
   <div className='p-5'>
    <p className='text-center'>
     <span className='inline-flex w-24 h-24 items-center justify-center rounded-[50%] bg-pink-100 text-red-500 text-6xl'>
      <LiaUserSolid />
     </span>
    </p>
    <p className='text-sm font-light text-center my-3'>Ha Thanh Tuan</p>
    <button className='h-7 text-white rounded-[14px] w-full  text-sm bg-orangeCt flex justify-center items-center'>
     Đăng xuất
    </button>
   </div>
   <ul>
    <li
     onClick={(e) => {
      setTab('YOUR_ACCOUNT')
     }}
     className={clsx(
      'flex items-center text-sm py-[6px] hover:bg-pink-100 hover:cursor-pointer mx-1 rounded mb-1 pl-5',
      {
       'bg-pink-100 text-orange-500 font-medium': tabName === 'YOUR_ACCOUNT'
      }
     )}
    >
     <span
      className={clsx('mr-2 text-2xl', {
       'font-medium text-red-500': tabName === 'YOUR_ACCOUNT'
      })}
     >
      <PiUserBold />
     </span>
     Tài khoản của tôi
    </li>
    <li
     onClick={(e) => {
      setTab('YOUR_ORDER')
     }}
     className={clsx(
      'flex items-center text-sm py-[6px] hover:bg-pink-100 hover:cursor-pointer mx-1 rounded mb-1 pl-5',
      {
       'bg-pink-100 text-orange-500 font-medium': tabName === 'YOUR_ORDER'
      }
     )}
    >
     <span
      className={clsx('mr-2 text-2xl', {
       'font-medium text-red-500': tabName === 'YOUR_ORDER'
      })}
     >
      <RxFileText />
     </span>
     Đơn hàng của tôi
    </li>
    <li
     onClick={(e) => {
      setTab('CHANGE_PASSWORD')
     }}
     className={clsx(
      'flex items-center text-sm py-[6px] hover:bg-pink-100 hover:cursor-pointer mx-1 rounded mb-1 pl-5',
      {
       'bg-pink-100 text-orange-500 font-medium': tabName === 'CHANGE_PASSWORD'
      }
     )}
    >
     <span
      className={clsx('mr-2 text-2xl', {
       'font-medium text-red-500': tabName === 'CHANGE_PASSWORD'
      })}
     >
      <TbLockCog />
     </span>
     Đổi mật khẩu
    </li>
    <li
     onClick={(e) => {
      setTab('LIST_ADDRESS')
     }}
     className={clsx(
      'flex items-center text-sm py-[6px] hover:bg-pink-100 hover:cursor-pointer mx-1 rounded mb-1 pl-5',
      {
       'bg-pink-100 text-orange-500 font-medium': tabName === 'LIST_ADDRESS'
      }
     )}
    >
     <span
      className={clsx('mr-2 text-2xl', {
       'font-medium text-red-500': tabName === 'LIST_ADDRESS'
      })}
     >
      <PiMapPinLine />
     </span>
     Sổ địa chỉ
    </li>
   </ul>
  </div>
 )
}

export default SideBarProfile
