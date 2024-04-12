import Image from 'next/image'
import React, { FC, useRef, useState } from 'react'
import { CgMenu } from 'react-icons/cg'
import { FiSearch } from 'react-icons/fi'
import { IoCallSharp, IoSearchOutline } from 'react-icons/io5'
import SearchDestop from './components/SearchDestop'
import Link from 'next/link'

interface IHeaderItemAbove {
 onOpenMenuMobile: () => void
 onOpenSearchMobile: () => void
}

const HeaderItemAbove: FC<IHeaderItemAbove> = ({
 onOpenMenuMobile,
 onOpenSearchMobile
}) => {
 const [isOpenAreaSeach, setIsOpenAreaSeach] = useState<boolean>(false)
 const handleFocusInput = () => {
  setIsOpenAreaSeach(true)
 }
 const handleBlurInput = () => {
  setIsOpenAreaSeach(false)
 }
 return (
  <div className='flex pt-3 lg:pb-2 pb-3 justify-between'>
   <div className='lg:block flex justify-between items-center flex-1'>
    <span
     className='lg:hidden text-3xl'
     onClick={onOpenMenuMobile}
    >
     <CgMenu />
    </span>
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
     <SearchDestop
      onFocusInput={handleFocusInput}
      onBlurInput={handleBlurInput}
      isOpenAreaSeach={isOpenAreaSeach}
     />
    </section>
    <div className='flex lg:hidden pt-1'>
     <button
      onClick={onOpenSearchMobile}
      className='text-3xl mr-5 text-[#11006f]'
     >
      <IoSearchOutline />
     </button>
     <Link href={{ pathname: '/cart' }}>
      <div className='relative mr-2'>
       <figure>
        <Image
         width={28}
         height={25}
         className='h-auto'
         src='./images/cart.svg'
         alt=''
        />
       </figure>
       <p className='bg-orangeCt flex justify-center items-center absolute top-[-5px] right-[-8px] w-[20px] h-[20px] rounded-[50%] text-sm font-semibold leading-none'>
        0
       </p>
      </div>
     </Link>
    </div>
   </div>
   <ul className='lg:flex hidden lg:items-center font-semibold'>
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
 )
}

export default HeaderItemAbove
