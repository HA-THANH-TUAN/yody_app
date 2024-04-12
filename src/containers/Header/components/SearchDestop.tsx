import Image from 'next/image'
import React, { FC } from 'react'
import { FiSearch } from 'react-icons/fi'
interface ISearchDestop {
 onFocusInput: () => void
 onBlurInput: () => void
 isOpenAreaSeach: boolean
}
const SearchDestop: FC<ISearchDestop> = ({
 onFocusInput,
 onBlurInput,
 isOpenAreaSeach
}) => {
 return (
  <section className='relative ml-6 z-[6003] lg:block hidden'>
   <div className='h-[2.5rem] lg:w-[25rem] xl:w-[28rem] flex'>
    <input
     onFocus={onFocusInput}
     //  onBlur={onBlurInput}
     className='rounded-l-md px-3 text-sm flex-1 transition-colors hover:border-orangeCt focus:border-orangeCt border-solid border-[white] border'
     placeholder='Tìm kiếm'
    />
    <button className='rounded-r-md bg-orangeCt w-[5rem] flex justify-center items-center text-xl '>
     <FiSearch />
    </button>
   </div>
   {isOpenAreaSeach && (
    <div className='absolute w-full bg-white top-[2.6rem] border border-zinc-100 rounded-sm shadow-md'>
     <div className='max-h-52 overflow-y-auto scroll-area-search scroll-smooth'>
      <ul className=''>
       {[...Array(5)].map((v, i) => (
        <>
         <li
          key={i}
          className='px-3 py-1 hover:bg-zinc-100 cursor-pointer result-product-item'
         >
          <div className='flex'>
           <figure className='w-[36px] h-[48px] mr-3'>
            <Image
             width={36}
             height={48}
             className='rounded-sm'
             alt=''
             src='/images/ao-so-mi-nu.webp'
            />
           </figure>
           <p className='flex-1 text-xs flex justify-between flex-col'>
            <p className='multiline-ellipsis-search-desktop'>
             Áo Polo Nữ Tay Ngắn Pique Mắt Chim Phối Bo Thoáng Khí Nữ Tay Ngắn
             Pique Mắt Chim Phối Bo Thoáng Khí Chim Phối B
            </p>
            <span className='font-medium mt-1'>350.000</span>
           </p>
          </div>
         </li>
        </>
       ))}
       <li className='mt-5 text-center text-sm font-medium hover:opacity-85 hover:cursor-pointer'>
        Xem tất cả
       </li>
      </ul>
      <section className='px-3'>
       <p className='mb-3 mt-5 font-medium text-sm'>Tìm kiếm gần đây</p>
       <ul>
        <li className='mb-2'>
         <span className='px-2 py-[6px] text-sm inline-block rounded-sm bg-zinc-100'>
          Áo thun
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-[6px] text-sm inline-block rounded-sm bg-zinc-100'>
          Áo sơ mi
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-[6px] text-sm inline-block rounded-sm bg-zinc-100'>
          Áo thun
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-[6px] text-sm inline-block rounded-sm bg-zinc-100'>
          Áo đồ thể thao
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-[6px] text-sm inline-block rounded-sm bg-zinc-100'>
          Áo polo
         </span>
        </li>
       </ul>
      </section>
     </div>
    </div>
   )}
  </section>
 )
}

export default SearchDestop
