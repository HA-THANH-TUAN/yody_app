import { ITabProfile } from '@/app/profile/page'
import React, { FC } from 'react'
import AccountSection from './AccountSection'
import YourOrderSection from './YourOrderSection'
import ChangePasswordSection from './ChangePasswordSection'
import ListAddressSection from './ListAddressSection'
interface ITabSection {
 tabName: ITabProfile['tabName']
}
const TabSection: FC<ITabSection> = ({ tabName }) => {
 return (
  <div className=''>
   {tabName === 'YOUR_ACCOUNT' ? (
    <AccountSection />
   ) : tabName === 'YOUR_ORDER' ? (
    <YourOrderSection />
   ) : tabName === 'CHANGE_PASSWORD' ? (
    <ChangePasswordSection />
   ) : tabName === 'LIST_ADDRESS' ? (
    <ListAddressSection />
   ) : (
    ''
   )}
  </div>
 )
}

export default TabSection
