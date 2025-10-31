import React from 'react'
import { useState } from 'react';

interface DateFilterProps {
  onApply: (month: number | 'full', year: number) => void;
  showCustomRange?: boolean;
  onCustomRangeClick?: () => void;
}

const DateFilter: React.FC<DateFilterProps>  = ({
  onApply,
  showCustomRange = true,
  onCustomRangeClick
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<number | 'full'>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

const months = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
  { value: "full", name: "Current Year" } // optional
];

  const startYear = 2020;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );
  
  const handleApply = () => {
    onApply(selectedMonth, selectedYear)
  };

  return (
    <div className='filters page-card mb-5 flex gap-10 justify-end' style={{ '--padding-x': '20px', '--padding-y': '0px' } as React.CSSProperties}>
      <select 
        name='month' 
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value === 'full' ? 'full' : Number(e.target.value))} 
      >
        {months.map((month) => (
          <option key={month.value} value={month.value} className='text-black'>
            {month.name}
          </option>
        ))}
      </select>
      
      <select 
        name="year"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year} className='text-black'>
            {year}
          </option>
        ))}
      </select>

      <button 
        className='btn-primary'
        onClick={handleApply}
      >
        Apply
      </button>

      {showCustomRange && (
        <button 
          className='btn-secondary'
          onClick={onCustomRangeClick}
        >
          Custom Range
        </button>
      )}
    </div>
  );
}

export default DateFilter