'use client'
import React from 'react'
import { CgMenu } from 'react-icons/cg'
import { FiSearch } from 'react-icons/fi'
import { IoCallSharp } from 'react-icons/io5'
import { BiCategory, BiUser } from 'react-icons/bi'
import MegaMenu from './MegaMenu'
import Image from 'next/image'

const data = [
 {
  name: 'Nam',
  categories: [
   {
    name: 'ÁO NAM',
    categories: [
     {
      name: 'Áo Polo'
     },
     {
      name: 'Áo Khoác'
     },
     {
      name: 'Áo Nỉ'
     },
     {
      name: 'Áo Sơ Mi'
     },
     {
      name: 'Áo Thun'
     },
     {
      name: 'Áo Giữ Nhiệt'
     },
     {
      name: 'Áo Len'
     },
     {
      name: 'Áo Vest'
     },
     {
      name: 'Áo Chống Nắng'
     }
    ]
   },
   {
    name: 'QUẦN NAM',
    categories: [
     {
      name: 'Quần Âu'
     },
     {
      name: 'Quần Kaki'
     },
     {
      name: 'Quần Jeans'
     },
     {
      name: 'Quần Short'
     }
    ]
   },
   {
    name: 'ĐỒ BỘ NAM'
   },
   {
    name: 'ĐỒ THỂ THAO NAM',
    categories: [
     {
      name: 'Bộ Thể Thao'
     },
     {
      name: 'Áo Thun Thể Thao'
     },
     {
      name: 'Áo Polo Thể Thao'
     },
     {
      name: 'Quần Thể Thao'
     }
    ]
   },
   {
    name: 'ĐỒ MẶC TRONG NAM',
    categories: [
     {
      name: 'Quần Lót'
     },
     {
      name: 'Áo Ba Lỗ'
     }
    ]
   },
   {
    name: 'PHỤ KIỆN NAM',
    categories: [
     {
      name: 'Giày'
     },
     {
      name: 'Thắt lưng'
     },
     {
      name: 'Phụ Kiện Khác'
     }
    ]
   },
   {
    name: 'NỔI BẬT',
    categories: [
     {
      name: 'Hàng Mới Về'
     },
     {
      name: 'Khử Mùi Vượt Trội'
     },
     {
      name: 'Thoáng Mát Tối Đa'
     },
     {
      name: 'Chống UV'
     }
    ]
   }
  ]
 }
]

const Header = () => {
 const handleMouseEnter = () => {
  window.document.body.style.backgroundColor = '#0000009e'
 }
 const handleMouseLeave = () => {
  window.document.body.style.backgroundColor = 'initial'
 }
 return (
  <header className='bg-header bg-no-repeat bg-cover box-shadow-header border-1 border-zinc-400'>
   <div className='max-w-7xl mx-auto'>
    <div className='flex py-3 justify-between'>
     <div>
      <div className='lg:hidden'>
       <CgMenu />
      </div>
      <section className='flex'>
       <div className='h-[2.2rem] object-cover'>
        <figure>
         <Image
          src='./images/logo.svg'
          width={80}
          height={30}
          alt='logo'
         />
        </figure>
       </div>
       <div className='ml-6 h-[2.5rem] w-[28rem] flex'>
        <input
         className='rounded-l-md px-3 text-sm flex-1 transition-colors hover:border-orangeCt focus:border-orangeCt border-solid border-[white] border'
         placeholder='Tìm kiếm'
        />
        <button className='rounded-r-md bg-orangeCt w-[5rem] flex justify-center items-center text-xl '>
         <FiSearch />
        </button>
       </div>
      </section>
     </div>
     <ul className='flex items-center font-semibold'>
      <li className='flex items-center '>
       <span>
        <IoCallSharp />
       </span>
       <a
        href='tel:+84 363319792'
        className='text-textBlueCt mx-1'
       >
        1800 2086
       </a>
       <span className='text-[12px] leading-normal bg-orangeCt flex items-center h-[26px] rounded-r-[13px] rounded-l-[13px] px-[10px] '>
        FREE
       </span>
      </li>
      <li className='mx-[10px]'>-</li>
      <li className='flex items-center'>
       <span className='text-textBlueCt text-[14px]'>Gọi đặt hàng</span>
       <span className='mx-1'>
        <IoCallSharp />
       </span>
       <span className='text-textBlueCt'>0363319792</span>
      </li>
     </ul>
    </div>
    <div className='flex justify-between relative items-center text-textBlueCt text-[14px] font-semibold pt-2 pb-1'>
     <ul className='flex'>
      <li className='item-nav item-spacing'>
       <span className='name-item'>SALE OFF 50%</span>
      </li>
      <li
       className='item-nav item-spacing'
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
      >
       <span className='name-item'>NỮ</span>
       <ul className='list-item-nav text-[black] w-full hidden p-6 bg-white rounded-b-md absolute z-[2000]'>
        <li>
         <section className='grid grid-cols-5'>
          <div className='col-span-4'>
           <ul className='grid grid-cols-4 gap-3'>
            {<MegaMenu categories={data[0]} />}
           </ul>
          </div>
          <div className='col-span-1'>
           <figure className='overflow-hidden rounded-sm'>
            <img
             src='https://bizweb.dktcdn.net/thumb/grande/100/438/408/themes/936254/assets/link_image_3_1.jpg?1705714645671'
             alt=''
            />
           </figure>
          </div>
         </section>
        </li>
       </ul>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>NAM</span>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>TRẺ EM</span>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>BỘ SƯU TẬP</span>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>ĐỒNG PHỤC</span>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>VỀ YODY</span>
      </li>
      <li className='item-nav item-spacing'>
       <span className='name-item'>BLOG</span>
      </li>
     </ul>
     <ul className='flex'>
      <li className='flex justify-center items-center'>
       <div className='relative'>
        <figure>
         <img
          width={28}
          src='https://bizweb.dktcdn.net/100/438/408/themes/936254/assets/icon-cart-header.svg?1705641455803'
          alt=''
         />
        </figure>
        <p className='bg-orangeCt flex justify-center items-center absolute top-[-5px] right-[-8px] w-[20px] h-[20px] rounded-[50%] text-sm font-semibold leading-none'>
         0
        </p>
       </div>
       <span className='ml-3 text-[15px] leading-none pt-1'>GIỎ HÀNG</span>
      </li>
      <li className='flex items-center ml-4'>
       <span className='text-[26px]'>
        <BiUser />
       </span>
       <span className='ml-1 leading-none pt-1'>TÀI KHOẢN</span>
       <span className='inline-block ml-1 font-light'> /</span>
       <span className='ml-1 leading-none pt-1'>ĐĂNG NHẬP</span>
      </li>
     </ul>
    </div>
   </div>
  </header>
 )
}

export default Header
