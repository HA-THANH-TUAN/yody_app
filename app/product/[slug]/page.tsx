import DetailProduct from '@/src/containers/Product/DetailProduct'

export default function Page({ params }: { params: { slug: string } }) {
 return (
  <div>
   <DetailProduct />
  </div>
 )
}
