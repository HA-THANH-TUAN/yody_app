import React from 'react'
import CartItem from './components/CartItem'

const AreaCart = () => {
 return (
  <div className=''>
   <h3 className='font-semibold mb-10'>
    GIỎ HÀNG
    <span className='font-normal ml-3 text-zinc-500'> (4) Sản phẩm</span>
   </h3>
   <ul>
    <li className='mb-4 hidden sm:block'>
     <div className='font-medium text-sm flex flex-wrap'>
      <span className='w-1/2'>Sản phẩm</span>
      <span className='w-[15%] text-center'>Đơn giá</span>
      <span className='w-[20%] text-center'>Số lượng</span>
      <span className='w-[15%] text-right'>Tổng tiền</span>
     </div>
    </li>
    {[...Array(6)].map((v, i) => (
     <CartItem key={i} />
    ))}
   </ul>
  </div>
 )
}

export default AreaCart
