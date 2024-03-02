import React from 'react'


// type Props = {
//     categories:{
//         name:string,
//         categories: Props.categories
//     }
// }

type CategoryType = {
    name:string,
    categories?: CategoryType[]

}

type MegaMenuType = {
    categories:CategoryType,
}

export default function MegaMenu({categories}: MegaMenuType) {
  return (
    <>
        {

            categories.categories?.length && categories.categories.map(
            (cat, index)=><li key={index} className='col-span-1'>
                <p className='mb-1 hover-category-item'>{cat.name}</p>
                    <ul>
                      {cat.categories?.map((subCat, indexNest)=><li key={indexNest} className='font-normal hover-category-item my-1'>{subCat.name}</li>)}
                    </ul>
            </li>)
        }

    </>
  )
}