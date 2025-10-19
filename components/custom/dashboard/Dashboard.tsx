import React from 'react'
import CardSection from '../tests/CardSection'
import ResponsiveLineChart from './ResponsiveLineChart'
import CurrentVisitsChart from './ResponsivePieChart'
import { TempTemplate } from './BottomList'

const Dashboard = () => {
  return (
    <div className="dashboardWrapper contentsd flex flex-col gap-6">
        <CardSection/>

        {/* <div className="grid gap-4 lg:grid-cols-7 md:grid-cols-5"> */}
        <div className='flex flex-col lg:flex-row items-center gap-5 justify-between md:flex-col trump'>
            {/* <div className='lg:col-span-4 md:col-span-3'> */}
            <div className='lg:flex-1'>
                <ResponsiveLineChart/>
            </div>

            {/* <div className='lg:col-span-3 md:col-span-2'> */}
            <div className='h-full'>
                <CurrentVisitsChart/>
            </div>
        </div>

        <TempTemplate/>
    </div>
  )
}

export default Dashboard