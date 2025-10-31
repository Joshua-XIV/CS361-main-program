import React, { useEffect } from 'react'
import { useState } from 'react';
import DateFilter from '../components/DateFilter';


const HomePage = () => {
  const [activeMonth, setActiveMonth] = useState<number | 'full'>(new Date().getMonth()+1)
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);

  const handleFilterApply = (month: number | 'full', year: number) => {
    setActiveMonth(month);
    setActiveYear(year);

    if (month === 'full') {

    } else {

    }
  }

  const fetchMonthlySummary = async (month: number, year: number) => {

  }

  const fetchYearlySummary = async (year: number) => {
    
  }

  const handleCustomerRangeClick = () => {

  }

  useEffect(() => {
    fetchMonthlySummary(activeMonth as number, activeYear);
  }, []);

  return (
    <>
      <DateFilter
        onApply={handleFilterApply}
        showCustomRange={false}
        onCustomRangeClick={handleCustomerRangeClick}
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='page-card min-h-20'>
          Hello
        </div>
        <div className='min-h-20 grid grid-cols-1 gap-5'>
          <div className='page-card'>
            Hello
          </div>
          <div className='page-card'>
            Hello2
          </div>
          <div className='page-card'>
            Hello3
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage