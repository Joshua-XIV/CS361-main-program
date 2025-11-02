import React from 'react'
import { useState } from 'react';

interface DateFilterProps {
  onApply: (month: number | 'full', year: number) => void;
  onApplyLastDays: (days: number) => void;
  showLastDays?: boolean;
}

const DateFilter: React.FC<DateFilterProps>  = ({
  onApply,
  onApplyLastDays,
  showLastDays
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<number | 'full'>(currentMonth);
  const [appliedMonth, setAppliedMonth] = useState<number | 'full'>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [appliedYear, setAppliedYear] = useState<number>(currentYear);
  const [isLastDaysMode, setIsLastDaysMode] = useState(false);
  const [lastDays, setLastDays] = useState<number>(30);

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
  { value: "full", name: "Entire Year" } // optional
];

  const startYear = 2020;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  let displayText = '';
  if (isLastDaysMode) {
    displayText = `Last ${lastDays} days`;
  } else if (selectedMonth === 'full') {
    displayText = `Year ${appliedYear}`;
  } else {
    const monthName = months.find(m => m.value === appliedMonth)?.name;
    displayText = `${monthName} ${appliedYear}`;
  }

  return (
    <div
      className="page-card mb-5 flex justify-between items-center"
      style={{ '--padding-x': '10px', '--padding-y': '0px' } as React.CSSProperties}
    >
      {/* Left side: display text */}
      <div className="text-lg font-semibold display-date-text">{displayText}</div>

      {/* Right side: controls */}
      <div className="items-center gap-4 flex p-2">
        {!isLastDaysMode ? (
          <>
            <div className="flex gap-2">
              <select
                name="month"
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(e.target.value === 'full' ? 'full' : Number(e.target.value))
                }
                className='date-dropdown'
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value} className="text-black">
                    {month.name}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className='date-dropdown'
              >
                {years.map((year) => (
                  <option key={year} value={year} className="text-black">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {showLastDays &&<button
                className="date-switch-btn"
                onClick={() => setIsLastDaysMode(true)}
              >
                Last Days
              </button>}
              <button
                className="date-apply-btn"
                onClick={() => {onApply(selectedMonth, selectedYear); setAppliedMonth(selectedMonth); setAppliedYear(selectedYear);}}
              >
                Apply
              </button>
            </div>
          </>
        ) : (
          <>
            <label className="items-center gap-2">
              <input
                type="number"
                min={1}
                value={lastDays}
                onChange={(e) => setLastDays(Number(e.target.value))}
                className="input input-sm w-20"
              />
              <span>days</span>
            </label>

            <button
              className="date-apply-btn"
              onClick={() => onApplyLastDays(lastDays)}
            >
              Apply
            </button>

            <button
              className="date-switch-btn"
              onClick={() => setIsLastDaysMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DateFilter