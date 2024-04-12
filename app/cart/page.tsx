import AreaCart from '@/src/containers/Cart/AreaCart'
import PayingBar from '@/src/containers/Cart/PayingBar'
import React from 'react'

const Cart = () => {
 return (
  <section className='lg:pt-10 p-3 sm:p-10 lg:p-0 min-h-96 bg-levender'>
   <section className='grid grid-cols-3 max-w-7xl mx-auto gap-x-5 gap-y-5 lg:gap-y-0  '>
    <div className='col-span-3 lg:col-span-2 bg-white p-4 rounded-sm'>
     <AreaCart />
    </div>
    <div className='col-span-3 lg:col-span-1 bg-white p-4 rounded-sm'>
     <PayingBar />
    </div>
   </section>
  </section>
 )
}

export default Cart
