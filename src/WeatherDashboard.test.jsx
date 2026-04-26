import { describe, it, expect } from 'vitest'
import { formatTemp } from './WeatherDashboard.jsx'

describe('formatTemp', () => {
  it('rounds and labels imperial temperatures', () => {
    expect(formatTemp(72.4, 'imperial')).toBe('72°F')
  })

  it('rounds and labels metric temperatures', () => {
    expect(formatTemp(22.6, 'metric')).toBe('23°C')
  })

  it('handles 0°C', () => {
    expect(formatTemp(0, 'metric')).toBe('0°C')
  })

  it('handles negative imperial temperatures', () => {
    expect(formatTemp(-10, 'imperial')).toBe('-10°F')
  })

  it('returns em dash for undefined', () => {
    expect(formatTemp(undefined, 'imperial')).toBe('—')
  })

  it('returns em dash for null', () => {
    expect(formatTemp(null, 'metric')).toBe('—')
  })

  it('defaults to °F when no unit is provided', () => {
    expect(formatTemp(72)).toBe('72°F')
  })
})
