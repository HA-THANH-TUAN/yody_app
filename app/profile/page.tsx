'use client'
import SideBarProfile from '@/src/containers/Profile/SideBarProfile'
import TabSection from '@/src/containers/Profile/TableSection/TabSection'
import React, { useState } from 'react'

export interface ITabProfile {
 tabName: 'YOUR_ACCOUNT' | 'YOUR_ORDER' | 'CHANGE_PASSWORD' | 'LIST_ADDRESS'
}

const Profile = () => {
 const [tab, setTab] = useState<ITabProfile['tabName']>('LIST_ADDRESS')
 return (
  <section className='bg-[#f8f8f8] min-h-screen'>
   <section className='max-w-7xl mx-auto'>
    <h2 className='text-orangeCt text-center font-medium text-lg py-4'>
     TÀI KHOẢN
    </h2>
    <section className='grid-cols-4 grid  gap-x-6'>
     <div className='col-span-1 bg-white'>
      <SideBarProfile
       tabName={tab}
       setTab={setTab}
      />
     </div>
     <div className='col-span-3 bg-white'>
      <TabSection tabName={tab} />
     </div>
    </section>
   </section>
  </section>
 )
}

export default Profile
