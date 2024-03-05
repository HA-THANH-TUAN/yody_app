import React, {
 Dispatch,
 Key,
 SetStateAction,
 useEffect,
 useState
} from 'react'
import { Button, Col, Form, Grid, Input, Row, Tree } from 'antd'
import type { GetProps, TreeDataNode } from 'antd'
import CategoryDetail from '../../Containers/CategoryDetail'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import {
 getCategories,
 selectCategories
} from '../../Features/categoryPageSlice'
import { ICategory } from '../../Models/response'
import { CiEdit } from 'react-icons/ci'
import { TiArrowSortedDown } from 'react-icons/ti'
import { MdDelete } from 'react-icons/md'
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>
const { DirectoryTree } = Tree

interface ITiltleCategory {
 title: string
 onClick: () => void
 setOpenDetailDraw: Dispatch<SetStateAction<boolean>>
 setDetailCategory: () => void
}

const TiltleCategory: React.FC<ITiltleCategory> = ({
 title,
 onClick,
 setOpenDetailDraw,
 setDetailCategory
}) => {
 return (
  <div className='flex justify-between'>
   <span onClick={onClick} className='flex items-center flex-1'>
    {title}
   </span>
   <Button
    onClick={(e) => {
     setDetailCategory()
     setOpenDetailDraw(true)
    }}
    danger
    type='primary'
    icon={<MdDelete />}
   />
   <Button
    onClick={(e) => {
     setDetailCategory()
     setOpenDetailDraw(true)
    }}
    type='primary'
    icon={<CiEdit />}
   />
  </div>
 )
}

const ProductCategory: React.FC = () => {
 const [detailCategory, setDetailCategory] = useState<ICategory>()
 const [openDetailDraw, setOpenDetailDraw] = useState<boolean>(true)
 const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
 console.log('openDetailDraw:::', openDetailDraw)
 console.log('setDetailCategory:::', detailCategory)
 useEffect(() => {
  dispatch(getCategories(123))
 }, [])

 const categories = useAppSelector(selectCategories)
 function recursiveConvert(data: ICategory[]): TreeDataNode[] {
  if (data.length > 0) {
   return data.map((value) => {
    const vlc = {
     title: (
      <TiltleCategory
       title={value.name}
       setDetailCategory={() => {
        setDetailCategory(value)
       }}
       setOpenDetailDraw={setOpenDetailDraw}
       onClick={() => {
        if (expandedKeys.includes(value._id)) {
         setExpandedKeys((state) => state.filter((k) => value._id !== k))
        } else {
         setExpandedKeys((state) => [...state, value._id])
        }
       }}
      />
     ),
     key: `${value._id}`,
     children:
      value.categories?.length > 0
       ? recursiveConvert(value.categories)
       : undefined,
     isLeaf: value.categories?.length > 0 ? false : true
    }
    return vlc
   })
  }
  return []
 }
 const data = recursiveConvert(categories)
 const dispatch = useAppDispatch()
 return (
  <Row gutter={[10, 10]}>
   <Col xs={24} lg={12} xl={10}>
    <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
     <h2 className='text-center mb-4 text-2xl font-semibold'>
      Structure of category
     </h2>
     <DirectoryTree
      multiple={true}
      defaultExpandAll={true}
      expandedKeys={expandedKeys}
      showLine={true}
      allowDrop={() => false}
      treeData={data}
     />
    </section>
   </Col>
   {detailCategory && (
    <CategoryDetail
     detailData={detailCategory}
     isOpenDraw={openDetailDraw}
     setOpenDraw={setOpenDetailDraw}
    />
   )}
  </Row>
 )
}

export default ProductCategory
