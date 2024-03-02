import React, { useEffect } from 'react'
import { AiFillStar } from 'react-icons/ai'
export const StarAttachProduct = () => {
 return (
  <div className='absolute rounded-tl rounded-br bg-[#0000008e] z-[10000] top-0 left-0 h-6 flex items-center px-2 '>
   <div className='flex'>
    <span className='mr-1 flex'>
     <AiFillStar className='text-yellow-400' />
     <span className='text-xs font-medium text-white'>5</span>
    </span>
    <span className='text-xs font-medium text-white'>Đã bán 17.K</span>
   </div>
  </div>
 )
}
