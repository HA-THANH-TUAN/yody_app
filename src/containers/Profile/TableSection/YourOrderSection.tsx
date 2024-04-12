import React from 'react'

const YourOrderSection = () => {
 return (
  <>
   <div className='flex justify-between items-center h-16 px-6'>
    <span className='text-orangeCt font-semibold'>Đơn hàng của tôi</span>
    <span className='text-zinc-500 font-semibold'>1 đơn hàng</span>
   </div>
   <hr />
   <div className=''>
    <table>
     <thead className='border-b border-solid bg-slate-100'>
      <th className='text-sm text-left font-medium h-14 pl-6 w-[120px]'>
       Mã đơn hàng
      </th>
      <th className='text-sm text-left font-medium h-14 px-3 w-[100px]'>
       Ngày mua
      </th>
      <th className='text-sm text-left font-medium h-14 px-3'>Địa chỉ</th>
      <th className='text-sm text-left font-medium h-14 px-3 w-[150px]'>
       Giá trị đơn hàng
      </th>
      <th className='text-sm text-left font-medium h-14 px-3  w-[180px]'>
       Trạng thái thanh toán
      </th>
      <th className='text-sm text-left font-medium h-14 pr-6  w-[180px]'>
       Trạng thái vận chuyển
      </th>
     </thead>
     <tbody>
      {[...Array(6)].map(() => (
       <>
        <tr className=''>
         <td className='text-sm py-3 pl-6'>#96550</td>
         <td className='text-sm py-3 px-3'>10:22 24/06/2023</td>
         <td className='text-sm py-3 px-3'>
          Ho Chi Minh, Thành phố Thủ Đức, TP Hồ Chí Minh,
         </td>
         <td className='text-sm py-3 px-3'>169.500đ</td>
         <td className='text-sm py-3 px-3'>Chưa thu tiền</td>
         <td className='text-sm py-3 pr-6'>Chưa chuyển</td>
        </tr>
       </>
      ))}
     </tbody>
    </table>
   </div>
  </>
 )
}

export default YourOrderSection
