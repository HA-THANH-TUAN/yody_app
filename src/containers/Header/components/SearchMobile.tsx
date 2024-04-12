import React, { FC, useEffect, useRef } from 'react'
import { FaArrowLeft, FaArrowLeftLong } from 'react-icons/fa6'
import { FiSearch } from 'react-icons/fi'
import { GoArrowLeft } from 'react-icons/go'
import { IoClose } from 'react-icons/io5'
interface ISearchMobile {
 onCancelMenuSearch: () => void
}
const SearchMobile: FC<ISearchMobile> = ({ onCancelMenuSearch }) => {
 const refInput = useRef<HTMLInputElement>(null)
 useEffect(() => {
  refInput.current?.focus()
 }, [])
 return (
  <section className='menu-mobile-component lg:hidden block'>
   <div className='fixed z-[6001] bg-[#00000080] top-0 bottom-0 left-0 w-full '>
    <div
     onClick={onCancelMenuSearch}
     className='absolute top-0 right-0 left-0 bottom-0'
    ></div>
    <div className='bg-white absolute top-0 right-0 block w-full sm:w-[600px] py-5 px-2 h-full overflow-y-auto'>
     <section>
      <p className='flex justify-around items-center text-lg font-medium'>
       <button
        onClick={onCancelMenuSearch}
        className='w-8 h-8 rounded-sm active:bg-zinc-200 active:text-red-500 flex justify-center text-2xl items-center'
       >
        <GoArrowLeft />
       </button>
       <span className='flex-1 text-center'>Tìm kiếm sản phẩm</span>
      </p>
      <div className='px-2 mt-4 h-[2.5rem] flex'>
       <input
        ref={refInput}
        className='rounded-l-md px-3 text-sm flex-1 transition-colors border-blue-600 border-solid border border-r-0'
        placeholder='Sản phẩm cần tìm ... '
       />
       <button className='rounded-r-md bg-orangeCt w-[2.5rem] flex justify-center items-center text-xl '>
        <FiSearch />
       </button>
      </div>
      <section className='px-3'>
       <p className='mb-3 mt-5 font-medium'>Tìm kiếm gần đây</p>
       <ul>
        <li className='mb-2'>
         <span className='px-2 py-2 text-sm inline-block rounded-sm bg-zinc-100'>
          Áo thun
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-2 text-sm inline-block rounded-sm bg-zinc-100'>
          Áo sơ mi
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-2 text-sm inline-block rounded-sm bg-zinc-100'>
          Áo thun
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-2 text-sm inline-block rounded-sm bg-zinc-100'>
          Áo đồ thể thao
         </span>
        </li>
        <li className='mb-2'>
         <span className='px-2 py-2 text-sm inline-block rounded-sm bg-zinc-100'>
          Áo polo
         </span>
        </li>
       </ul>
      </section>
     </section>
    </div>
   </div>
  </section>
 )
}

export default SearchMobile
