'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CalculatorFormProps {
  initialSalary?: string
  initialRegion?: string
}

export default function CalculatorForm({ initialSalary = '', initialRegion = 'uk' }: CalculatorFormProps) {
  const [salary, setSalary] = useState(initialSalary)
  const [region, setRegion] = useState(initialRegion)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseInt(salary.replace(/,/g, ''))
    if (isNaN(num) || num < 0) return
    router.push(`/salary/${num}-${region}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="salary-input" className="block text-sm font-medium text-navy mb-1">
            Annual Salary (£)
          </label>
          <input
            id="salary-input"
            type="text"
            inputMode="numeric"
            value={salary}
            onChange={(e) => setSalary(e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder="e.g. 35,000"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-navy bg-white focus:border-mint focus:ring-2 focus:ring-mint/20 outline-none transition-colors text-lg"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium text-navy mb-1">
            Region
          </label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-navy bg-white focus:border-mint focus:ring-2 focus:ring-mint/20 outline-none transition-colors"
          >
            <option value="uk">United Kingdom (England, Wales, NI)</option>
            <option value="scotland">Scotland</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-mint hover:bg-mint-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Calculate Take-Home Pay
        </button>
      </div>
    </form>
  )
}
