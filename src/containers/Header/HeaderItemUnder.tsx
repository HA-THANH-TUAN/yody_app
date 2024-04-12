import Link from 'next/link'
import React, { FC } from 'react'
import { BiUser } from 'react-icons/bi'
import MegaMenu from './components/MegaMenu'
import Image from 'next/image'

interface IHeaderItemUnder {
 onMouseEnterItem: () => void
 onMouseLeaveItem: () => void
 categories: any[]
}
const HeaderItemUnder: FC<IHeaderItemUnder> = ({
 onMouseEnterItem,
 onMouseLeaveItem,
 categories
}) => {
 return (
  <div className='flex justify-between relative items-center text-textBlueCt text-[14px] font-semibold py-1'>
   <ul className='flex'>
    <li className='item-nav lg:mr-3 xl:mr-8'>
     <span className='name-item'>SALE OFF 50%</span>
    </li>
    <li
     className='item-nav lg:mx-2 xl:mx-3'
     onMouseEnter={onMouseEnterItem}
     onMouseLeave={onMouseLeaveItem}
    >
     <span className='name-item'>NỮ</span>
     <MegaMenu categories={categories[0]} />
    </li>
    <li
     className='item-nav lg:mx-2 xl:mx-3'
     onMouseEnter={onMouseEnterItem}
     onMouseLeave={onMouseLeaveItem}
    >
     <span className='name-item'>NAM</span>
     <MegaMenu categories={categories[0]} />
    </li>
    <li
     className='item-nav lg:mx-2 xl:mx-3'
     onMouseEnter={onMouseEnterItem}
     onMouseLeave={onMouseLeaveItem}
    >
     <span className='name-item'>TRẺ EM</span>
     <MegaMenu categories={categories[0]} />
    </li>
    <li className='item-nav lg:mx-2 xl:mx-3'>
     <span className='name-item'>BỘ SƯU TẬP</span>
    </li>
    <li className='item-nav lg:mx-2 xl:mx-3'>
     <span className='name-item'>ĐỒNG PHỤC</span>
    </li>
    <li className='item-nav lg:mx-2 xl:mx-3'>
     <span className='name-item'>VỀ YODY</span>
    </li>
    <li className='item-nav lg:mx-2 xl:mx-3'>
     <span className='name-item'>BLOG</span>
    </li>
   </ul>
   <ul className='flex'>
    <li className='flex justify-center items-center'>
     <div className='relative'>
      <figure>
       <Image
        width={28}
        height={30}
        src='/images/cart.svg'
        alt=''
       />
      </figure>
      <p className='bg-orangeCt flex justify-center items-center absolute top-[-5px] right-[-8px] w-[20px] h-[20px] rounded-[50%] text-sm font-semibold leading-none'>
       0
      </p>
     </div>
     <Link href={{ pathname: '/cart' }}>
      <span className='ml-3 text-[15px] leading-none pt-1 hidden lg:block'>
       GIỎ HÀNG
      </span>
     </Link>
    </li>
    <li className='flex items-center ml-4'>
     <span className='text-[26px]'>
      <BiUser />
     </span>
     <Link href={{ pathname: '/sign-in' }}>
      <span className='ml-1 leading-none pt-1'>ĐĂNG NHẬP</span>
     </Link>
     <span className='inline-block ml-1 font-light'> / </span>
     <Link href={{ pathname: '/sign-up' }}>
      <span className='ml-1 leading-none pt-1'>ĐĂNG KÍ</span>
     </Link>
     {/* <span className='ml-1 leading-none pt-1'>TÀI KHOẢN</span> */}
    </li>
   </ul>
  </div>
 )
}

export default HeaderItemUnder
