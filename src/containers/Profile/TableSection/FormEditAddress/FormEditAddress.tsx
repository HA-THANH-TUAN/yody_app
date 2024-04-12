import React, { FC } from 'react'
import { CgClose } from 'react-icons/cg'
import { IoChevronDownSharp, IoClose } from 'react-icons/io5'
import './FormEditAddress.css'

interface IFormEditAddress {
 title?: string
 open?: boolean
 onCancel?: () => void
}

const FormEditAddress: FC<IFormEditAddress> = ({
 title = 'Sửa Thông tin địa chỉ',
 open = false,
 onCancel
}) => {
 return (
  <div className='form-edit-address-component'>
   <section className='absolute w-screen h-screen flex items-center justify-center top-0 right-0 '>
    <div
     onClick={onCancel}
     className='relative w-full h-screen top-0 bg-[#00000098]'
    ></div>
    <div className='absolute w-full pointer-events-none'>
     <section className='bg-white rounded-md max-w-3xl mx-auto pb-6 pointer-events-auto'>
      <div className='px-5 flex items-center h-14 justify-between'>
       <span className='font-semibold'>{title}</span>
       <button
        className='hover:opacity-80 text-2xl'
        onClick={onCancel}
       >
        <IoClose />
       </button>
      </div>
      <hr />

      <form className='px-5 py-6 form '>
       <ul className='grid grid-cols-6 gap-5'>
        <li className='col-span-3'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid input-item'>
          <input
           className='absolute top-0 right-0 left-0 bottom-0 font-light px-3'
           type='text'
           placeholder=''
          />
          <label className='absolute z-20 pl-3 text-zinc-400 pointer-events-none'>
           Họ tên
          </label>
         </div>
        </li>
        <li className='col-span-3'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid input-item'>
          <input
           className='absolute top-0 right-0 left-0 bottom-0 font-light px-3'
           type='text'
           placeholder=''
          />
          <label className='absolute z-20 pl-3 text-zinc-400 pointer-events-none'>
           Số điện thoại
          </label>
         </div>
        </li>
        <li className='col-span-6'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid input-item'>
          <input
           className='absolute top-0 right-0 left-0 bottom-0 font-light px-3'
           type='text'
           placeholder=''
          />
          <label className='absolute z-20 pl-3 text-zinc-400 pointer-events-none'>
           Công ty
          </label>
         </div>
        </li>
        <li className='col-span-6'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid input-item'>
          <input
           className='absolute top-0 right-0 left-0 bottom-0 font-light px-3'
           type='text'
           placeholder=''
          />
          <label className='absolute z-20 pl-3 text-zinc-400 pointer-events-none'>
           Địa chỉ
          </label>
         </div>
        </li>
        <li className='col-span-2'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid select-item'>
          <div className='absolute top-0 right-0 bottom-0 left-0'>
           <input
            className='absolute z-20 pointer-events-none top-0 right-0 left-0 bottom-0 font-light px-3 pt-5'
            type='text'
            placeholder='.....'
           />
           <div className='w-full px-2 absolute top-0 right-0 bottom-0 left-0'>
            <select
             id='select-province'
             value={''}
             className=' outline-none mt-5 w-full'
            >
             <option
              value=''
              disabled
             >
              ............
             </option>
             <option value='1'>1</option>
             <option value='2'>1</option>
             <option value='3'>1</option>
             <option value='4'>1</option>
             <option value='5'>1</option>
            </select>
           </div>
          </div>
          <label
           htmlFor='select-province'
           className='absolute z-20 pl-3 top-0 text-xs text-zinc-400 pointer-events-none'
          >
           Tỉnh thành
          </label>
          <span className='absolute z-20 w-6 h-6 flex items-center justify-center top-[calc(50%-12px)] right-0'>
           <IoChevronDownSharp />
          </span>
         </div>
        </li>
        <li className='col-span-2'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid select-item'>
          <div className='absolute top-0 right-0 bottom-0 left-0'>
           <input
            className='absolute z-20 pointer-events-none top-0 right-0 left-0 bottom-0 font-light px-3 pt-5'
            type='text'
            placeholder='.....'
           />
           <div className='w-full px-2 absolute top-0 right-0 bottom-0 left-0'>
            <select
             id='select-province'
             value={''}
             className=' outline-none mt-5 w-full'
            >
             <option
              value=''
              disabled
             >
              ............
             </option>
             <option value='1'>1</option>
             <option value='2'>1</option>
             <option value='3'>1</option>
             <option value='4'>1</option>
             <option value='5'>1</option>
            </select>
           </div>
          </div>
          <label
           htmlFor='select-province'
           className='absolute z-20 pl-3 top-0 text-xs text-zinc-400 pointer-events-none'
          >
           Tỉnh thành
          </label>
          <span className='absolute z-20 w-6 h-6 flex items-center justify-center top-[calc(50%-12px)] right-0'>
           <IoChevronDownSharp />
          </span>
         </div>
        </li>
        <li className='col-span-2'>
         <div className='relative h-12 overflow-hidden rounded flex items-center border border-solid select-item'>
          <div className='absolute top-0 right-0 bottom-0 left-0'>
           <input
            className='absolute z-20 pointer-events-none top-0 right-0 left-0 bottom-0 font-light px-3 pt-5'
            type='text'
            placeholder='.....'
           />
           <div className='w-full px-2 absolute top-0 right-0 bottom-0 left-0'>
            <select
             id='select-province'
             value={''}
             className=' outline-none mt-5 w-full'
            >
             <option
              value=''
              disabled
             >
              ............
             </option>
             <option value='1'>1</option>
             <option value='2'>1</option>
             <option value='3'>1</option>
             <option value='4'>1</option>
             <option value='5'>1</option>
            </select>
           </div>
          </div>
          <label
           htmlFor='select-province'
           className='absolute z-20 pl-3 top-0 text-xs text-zinc-400 pointer-events-none'
          >
           Tỉnh thành
          </label>
          <span className='absolute z-20 w-6 h-6 flex items-center justify-center top-[calc(50%-12px)] right-0'>
           <IoChevronDownSharp />
          </span>
         </div>
        </li>
       </ul>
       <p className='flex text-sm mt-6 items-center'>
        <input
         id='choosed-default'
         type='checkbox'
         className='w-4 h-4 mr-2'
        />
        <label htmlFor='choosed-default'>Đặt là địa chỉ mặc định?</label>
       </p>
       <ul className=' grid grid-cols-2 gap-x-5 font-semibold mt-10'>
        <li className='col-span-1'>
         <button className='bg-pink-100 hover:opacity-85 rounded w-full h-10 text-orangeCt'>
          Hủy
         </button>
        </li>
        <li className='col-span-1'>
         <button className='bg-orangeCt hover:opacity-85 rounded w-full h-10 py-2 text-white'>
          Lưu
         </button>
        </li>
       </ul>
      </form>
     </section>
    </div>
   </section>
  </div>
 )
}

export default FormEditAddress
