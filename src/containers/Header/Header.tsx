'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CgMenu } from 'react-icons/cg'
import { FiSearch } from 'react-icons/fi'
import { IoCallSharp, IoSearchOutline } from 'react-icons/io5'
import { BiCategory, BiUser } from 'react-icons/bi'
import MegaMenu from './components/MegaMenu'
import Image from 'next/image'
import Link from 'next/link'
import HeaderItemUnder from './HeaderItemUnder'
import MenuMobile from './components/MenuMobil/MenuMobile'
import HeaderItemAbove from './HeaderItemAbove'
import SearchMobile from './components/SearchMobile'

export interface ITest {
 id: string
 name: string
 categories?: ITest[]
}

const data: ITest[] = [
 {
  name: 'NAM',
  categories: [
   {
    name: 'ÁO NAM',
    categories: [
     {
      name: 'Áo Polo',
      id: 'fd71a62d704eb3a300631b5d'
     },
     {
      name: 'Áo Khoác',
      id: 'd71a62d704eb3a300631b5d2'
     },
     {
      name: 'Áo Nỉ',
      id: '71a62d704eb3a300631b5d2e'
     },
     {
      name: 'Áo Sơ Mi',
      id: '1a62d704eb3a300631b5d2e7'
     },
     {
      name: 'Áo Thun',
      id: 'a62d704eb3a300631b5d2e76'
     },
     {
      name: 'Áo Giữ Nhiệt',
      id: '62d704eb3a300631b5d2e769'
     },
     {
      name: 'Áo Len',
      id: '2d704eb3a300631b5d2e7694'
     },
     {
      name: 'Áo Vest',
      id: 'd704eb3a300631b5d2e7694e'
     },
     {
      name: 'Áo Chống Nắng',
      id: '704eb3a300631b5d2e7694e6'
     }
    ],
    id: 'ffd71a62d704eb3a300631b5'
   },
   {
    name: 'QUẦN NAM',
    categories: [
     {
      name: 'Quần Âu',
      id: '4eb3a300631b5d2e7694e6aa'
     },
     {
      name: 'Quần Kaki',
      id: 'eb3a300631b5d2e7694e6aa5'
     },
     {
      name: 'Quần Jeans',
      id: 'b3a300631b5d2e7694e6aa5f'
     },
     {
      name: 'Quần Short',
      id: '3a300631b5d2e7694e6aa5f7'
     }
    ],
    id: '04eb3a300631b5d2e7694e6a'
   },
   {
    name: 'ĐỒ BỘ NAM',
    id: 'a300631b5d2e7694e6aa5f75'
   },
   {
    name: 'ĐỒ THỂ THAO NAM',
    categories: [
     {
      name: 'Bộ Thể Thao',
      id: '00631b5d2e7694e6aa5f7503'
     },
     {
      name: 'Áo Thun Thể Thao',
      id: '0631b5d2e7694e6aa5f75033'
     },
     {
      name: 'Áo Polo Thể Thao',
      id: '631b5d2e7694e6aa5f750339'
     },
     {
      name: 'Quần Thể Thao',
      id: '31b5d2e7694e6aa5f7503397'
     }
    ],
    id: '300631b5d2e7694e6aa5f750'
   },
   {
    name: 'ĐỒ MẶC TRONG NAM',
    categories: [
     {
      name: 'Quần Lót',
      id: 'b5d2e7694e6aa5f750339738'
     },
     {
      name: 'Áo Ba Lỗ',
      id: '5d2e7694e6aa5f7503397388'
     }
    ],
    id: '1b5d2e7694e6aa5f75033973'
   },
   {
    name: 'PHỤ KIỆN NAM',
    categories: [
     {
      name: 'Giày',
      id: '2e7694e6aa5f7503397388a8'
     },
     {
      name: 'Thắt lưng',
      id: 'e7694e6aa5f7503397388a89'
     },
     {
      name: 'Phụ Kiện Khác',
      id: '7694e6aa5f7503397388a892'
     }
    ],
    id: 'd2e7694e6aa5f7503397388a'
   },
   {
    name: 'NỔI BẬT',
    categories: [
     {
      name: 'Hàng Mới Về',
      id: '94e6aa5f7503397388a8922d'
     },
     {
      name: 'Khử Mùi Vượt Trội',
      id: '4e6aa5f7503397388a8922d8'
     },
     {
      name: 'Thoáng Mát Tối Đa',
      id: 'e6aa5f7503397388a8922d8e'
     },
     {
      name: 'Chống UV',
      id: '6aa5f7503397388a8922d8e2'
     }
    ],
    id: '694e6aa5f7503397388a8922'
   }
  ],
  id: 'bffd71a62d704eb3a300631b'
 },
 {
  name: 'NỮ',
  categories: [
   {
    name: 'ÁO NỮ',
    categories: [
     {
      name: 'Áo Polo',
      id: '5f7503397388a8922d8e2d7c'
     },
     {
      name: 'Áo Khoác',
      id: 'f7503397388a8922d8e2d7c0'
     },
     {
      name: 'Áo Nỉ',
      id: '7503397388a8922d8e2d7c01'
     },
     {
      name: 'Áo Sơ Mi',
      id: '503397388a8922d8e2d7c016'
     },
     {
      name: 'Áo Thun',
      id: '03397388a8922d8e2d7c016b'
     },
     {
      name: 'Áo Giữ Nhiệt',
      id: '3397388a8922d8e2d7c016b7'
     },
     {
      name: 'Áo Len',
      id: '397388a8922d8e2d7c016b7d'
     },
     {
      name: 'Áo Vest',
      id: '97388a8922d8e2d7c016b7db'
     },
     {
      name: 'Áo Chống Nắng',
      id: '7388a8922d8e2d7c016b7db1'
     }
    ],
    id: 'a5f7503397388a8922d8e2d7'
   },
   {
    name: 'QUẦN NỮ',
    categories: [
     {
      name: 'Quần Âu',
      id: '88a8922d8e2d7c016b7db17e'
     },
     {
      name: 'Quần Kaki',
      id: '8a8922d8e2d7c016b7db17e4'
     },
     {
      name: 'Quần Jeans',
      id: 'a8922d8e2d7c016b7db17e4c'
     },
     {
      name: 'Quần Short',
      id: '8922d8e2d7c016b7db17e4cb'
     }
    ],
    id: '388a8922d8e2d7c016b7db17'
   },
   {
    name: 'ĐỒ BỘ NỮ',
    id: '922d8e2d7c016b7db17e4cb4'
   },
   {
    name: 'ĐỒ THỂ THAO NỮ',
    categories: [
     {
      name: 'Bộ Thể Thao',
      id: '2d8e2d7c016b7db17e4cb47e'
     },
     {
      name: 'Áo Thun Thể Thao',
      id: 'd8e2d7c016b7db17e4cb47e2'
     },
     {
      name: 'Áo Polo Thể Thao',
      id: '8e2d7c016b7db17e4cb47e21'
     },
     {
      name: 'Quần Thể Thao',
      id: 'e2d7c016b7db17e4cb47e21d'
     }
    ],
    id: '22d8e2d7c016b7db17e4cb47'
   },
   {
    name: 'ĐỒ MẶC TRONG NỮ',
    categories: [
     {
      name: 'Quần Lót',
      id: 'd7c016b7db17e4cb47e21d62'
     },
     {
      name: 'Áo Ba Lỗ',
      id: '7c016b7db17e4cb47e21d623'
     }
    ],
    id: '2d7c016b7db17e4cb47e21d6'
   },
   {
    name: 'PHỤ KIỆN NỮ',
    categories: [
     {
      name: 'Giày',
      id: '016b7db17e4cb47e21d6230a'
     },
     {
      name: 'Thắt lưng',
      id: '16b7db17e4cb47e21d6230a4'
     },
     {
      name: 'Phụ Kiện Khác',
      id: '6b7db17e4cb47e21d6230a4e'
     }
    ],
    id: 'c016b7db17e4cb47e21d6230'
   },
   {
    name: 'NỔI BẬT',
    categories: [
     {
      name: 'Hàng Mới Về',
      id: '7db17e4cb47e21d6230a4e72'
     },
     {
      name: 'Khử Mùi Vượt Trội',
      id: 'db17e4cb47e21d6230a4e723'
     },
     {
      name: 'Thoáng Mát Tối Đa',
      id: 'b17e4cb47e21d6230a4e723c'
     },
     {
      name: 'Chống UV',
      id: '17e4cb47e21d6230a4e723c4'
     }
    ],
    id: 'b7db17e4cb47e21d6230a4e7'
   }
  ],
  id: 'aa5f7503397388a8922d8e2d'
 }
]

const Header = () => {
 const [isOpenMenuMobile, setIsOpenMenuMobile] = useState<boolean>(false)
 const [isOpenSearchMobile, setIsOpenSearchMobile] = useState<boolean>(false)
 const [collapseIds, setCollapseIds] = useState<string[]>([
  'bffd71a62d704eb3a300631b'
 ])
 const refDivOverlay = useRef<HTMLDivElement>(null)
 const handleMouseEnter = () => {
  if (refDivOverlay.current) {
   refDivOverlay.current.style.display = 'block'
  }
 }
 const handleMouseLeave = () => {
  if (refDivOverlay.current) {
   refDivOverlay.current.style.display = 'none'
  }
 }
 useEffect(() => {
  if (refDivOverlay.current) {
   refDivOverlay.current.style.display = 'none'
  }
 }, [])
 const hanldeOnOpenCollapse = (id: string) => {
  if (!collapseIds.includes(id)) {
   setCollapseIds((state) => [...state, id])
  }
 }
 const hanldeOnCloseCollapse = (id: string) => {
  setCollapseIds((state) => [...state].filter((vl) => vl !== id))
 }
 const handleOnCloseSearchMobile = () => {
  setIsOpenSearchMobile(false)
 }
 const handleOnOpenSearchMobile = () => {
  setIsOpenSearchMobile(true)
 }
 const handleOnOpenMenuMobile = () => {
  setIsOpenMenuMobile(true)
 }
 const handleOnCloseMenuMobile = () => {
  setIsOpenMenuMobile(false)
 }

 return (
  <>
   <div
    ref={refDivOverlay}
    className='absolute z-[1999] hidden lg:block w-full h-full left-0 bg-[#00000077]'
   ></div>

   {isOpenSearchMobile && (
    <SearchMobile onCancelMenuSearch={handleOnCloseSearchMobile} />
   )}
   {isOpenMenuMobile && (
    <MenuMobile
     onCancelMenu={handleOnCloseMenuMobile}
     collapseIds={collapseIds}
     onOpenCollapse={hanldeOnOpenCollapse}
     onCloseCollapse={hanldeOnCloseCollapse}
     data={data}
    />
   )}
   <div className='fixed z-[6000] top-0 w-full'>
    <section className='bg-white lg:bg-[url("/images/background-header.webp")] bg-no-repeat h-[62px] lg:h-[104px] bg-cover box-shadow-header border-1 border-zinc-400'>
     <header className='px-3 sm:px-10 lg:px-6'>
      <div className='max-w-7xl mx-auto'>
       <HeaderItemAbove
        onOpenMenuMobile={handleOnOpenMenuMobile}
        onOpenSearchMobile={handleOnOpenSearchMobile}
       />
       <section className='hidden lg:block'>
        <HeaderItemUnder
         onMouseEnterItem={handleMouseEnter}
         onMouseLeaveItem={handleMouseLeave}
         categories={data}
        />
       </section>
      </div>
     </header>
    </section>
   </div>
  </>
 )
}

export default Header
