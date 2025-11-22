import React, { useEffect } from 'react'
import { useState } from 'react';
import DateFilter from '../components/DateFilter';
import FunFact from '../components/FunFactBox';


const HomePage = () => {
  const [activeMonth, setActiveMonth] = useState<number | 'full'>(new Date().getMonth()+1)
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);
  const [lastDays, setLastDays] = useState<number | null>(null);

  const handleFilterApply = (month: number | 'full', year: number) => {
    setActiveMonth(month);
    setActiveYear(year);
    setLastDays(null);

    if (month === 'full') {
      fetchYearlySummary(year)
    } else {
      fetchMonthlySummary(month, year)
    }
  }

  const handleApplyLastDays = (days: number) => {
    setLastDays(days);
    fetchLastDaysSummary(days);
  };

  const fetchMonthlySummary = async (month: number, year: number) => {
    console.log(`fetching ${month} month ${year} year`)
  }

  const fetchYearlySummary = async (year: number) => {
    console.log(`fetching ${year} year`)
  }

  const fetchLastDaysSummary = async (days: number) => {
    console.log(`fetching last ${days} days`)
  }

  useEffect(() => {
    fetchMonthlySummary(activeMonth as number, activeYear);
  }, []);

  return (
    <>
      <h1 className='pb-4 text-center'>Dashboard</h1>
      <FunFact/>
      <DateFilter
        onApply={handleFilterApply}
        onApplyLastDays={handleApplyLastDays}
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