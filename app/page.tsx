import CategoryHome from '@/src/containers/Home/CategoryHome'
import ProductListBlock from '@/src/containers/Home/ProductListBlock'
import SliderHome from '@/src/containers/Home/SliderHome'

export default function Home() {
 return (
  <main className='max-w-7xl mx-auto'>
   <SliderHome />
   <CategoryHome />
   <ProductListBlock />
  </main>
 )
}
