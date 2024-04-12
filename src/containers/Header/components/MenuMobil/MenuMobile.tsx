import React, { FC, useEffect, useId } from 'react'
import { BiUser } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { TiMessages } from 'react-icons/ti'
import { ITest } from '../../Header'
import { LuPlus } from 'react-icons/lu'
import { uid } from 'uid'
import clsx from 'clsx'
import { GrFormSubtract } from 'react-icons/gr'

interface IMenuMobile {
 onCancelMenu: () => void
 data: ITest[]
 collapseIds?: string[]
 onOpenCollapse: (id: string) => void
 onCloseCollapse: (id: string) => void
}
const MenuMobile: FC<IMenuMobile> = ({
 onCancelMenu,
 data,
 collapseIds = [],
 onOpenCollapse,
 onCloseCollapse
}) => {
 const recursiveCategoriesHtml = (category: ITest[], i = 0, id?: string) => {
  i++
  return (
   <ul
    className={clsx({
     'h-0 overflow-hidden': i > 1 && id && !collapseIds.includes(id)
     //  'h-auto overflow-hidden': !(item && !collapseIds.includes(category[0].id))
    })}
   >
    {category.map((cate) => {
     return (
      <li
       style={{ paddingLeft: `${(i - 1) * 15}px` }}
       key={cate.id}
      >
       <p className='flex justify-between '>
        <span
         className={clsx(
          'flex-1 w-8 h-8 flex  items-center hover:opacity-75 cursor-pointer',
          {
           'font-semibold': i === 1,
           'font-medium': i === 2
          }
         )}
        >
         {cate.name}
        </span>
        {Array.isArray(cate?.categories) &&
         (collapseIds.includes(cate.id ?? '') ? (
          <button
           onClick={() => {
            onCloseCollapse(cate.id)
           }}
           className='w-8 h-8 flex justify-center items-center text-xl'
          >
           <GrFormSubtract />
          </button>
         ) : (
          <button
           onClick={() => {
            onOpenCollapse(cate.id)
           }}
           className='w-8 h-8 flex justify-center items-center text-xl'
          >
           <LuPlus />
          </button>
         ))}
       </p>

       {Array.isArray(cate.categories) &&
        recursiveCategoriesHtml(cate.categories, i, cate.id)}
      </li>
     )
    })}
   </ul>
  )
 }

 return (
  <section className='menu-mobile-component lg:hidden block'>
   <div className='fixed z-[6001] bg-[#00000080] top-0 bottom-0 left-0 w-full'>
    <div
     onClick={onCancelMenu}
     className='absolute top-0 right-0 left-0 bottom-0'
    ></div>
    <div className='bg-white relative block max-w-[800px] py-5 h-full overflow-y-auto'>
     <p className='px-8 flex justify-between mb-5'>
      <span className='font-semibold text-xl'>MENU</span>{' '}
      <button
       onClick={onCancelMenu}
       className='font-medium text-2xl active:bg-slate-200 active:text-red-600 hover:bg-slate-200 flex justify-center items-center rounded-sm w-8 h-8 acive:border active:border-solid active:border-zinc-400'
      >
       <IoClose />
      </button>
     </p>
     <hr />
     <section>
      <div className='px-8 my-4'>{recursiveCategoriesHtml(data)}</div>
      <hr />
      <ul className='px-8 mt-4'>
       <li className='flex items-center hover:opacity-80 hover:cursor-pointer font-medium text-zinc-800'>
        <span className='w-8 h-8 mr-3 justify-center text-2xl flex items-center'>
         <TiMessages />
        </span>
        Tư vấn qua Zalo
       </li>
       <li className='flex items-center hover:opacity-80 hover:cursor-pointer font-medium text-zinc-800'>
        <span className='w-8 h-8 mr-3 justify-center text-2xl flex items-center'>
         <BiUser />
        </span>
        Đăng nhập
       </li>
      </ul>
     </section>
    </div>
   </div>
  </section>
 )
}

export default MenuMobile
