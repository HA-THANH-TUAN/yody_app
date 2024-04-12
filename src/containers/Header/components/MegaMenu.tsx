import Image from 'next/image'
import React from 'react'

// type Props = {
//     categories:{
//         name:string,
//         categories: Props.categories
//     }
// }

type CategoryType = {
 name: string
 categories?: CategoryType[]
}

type MegaMenuType = {
 categories: CategoryType
}

export default function MegaMenu({ categories }: MegaMenuType) {
 return (
  <>
   <ul className='list-item-nav text-[black] w-full hidden p-6 bg-white rounded-b-md absolute z-[30000]'>
    <li>
     <section className='grid grid-cols-5'>
      <div className='col-span-4'>
       <ul className='grid grid-cols-4 gap-3'>
        {categories.categories?.length &&
         categories.categories.map((cat, index) => (
          <li
           key={index}
           className='col-span-1'
          >
           <p className='mb-1 hover-category-item'>{cat.name}</p>
           <ul>
            {cat.categories?.map((subCat, indexNest) => (
             <li
              key={indexNest}
              className='font-normal hover-category-item my-1'
             >
              {subCat.name}
             </li>
            ))}
           </ul>
          </li>
         ))}
       </ul>
      </div>
      <div className='col-span-1'>
       <figure className='overflow-hidden rounded-sm'>
        <Image
         src='/images/ao-so-mi-nu.webp'
         width={300}
         height={400}
         alt=''
        />
       </figure>
      </div>
     </section>
    </li>
   </ul>
  </>
 )
}
