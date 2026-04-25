import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  Column,
  Grid,
  Heading,
  InlineLoading,
  InlineNotification,
  Stack,
  Tile,
} from '@carbon/react'
import { WeatherStation } from '@carbon/icons-react'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/** OpenWeather 5-day / 3-hour `list` grouped by calendar day (up to 5 days). */
function groupForecastsByDay(list) {
  const byDay = new Map()
  for (const item of list) {
    const dayKey = item.dt_txt.slice(0, 10)
    if (!byDay.has(dayKey)) byDay.set(dayKey, [])
    byDay.get(dayKey).push(item)
  }
  return [...byDay.entries()]
    .slice(0, 5)
    .map(([dateKey, items]) => ({ dateKey, items }))
}

function formatDayHeading(dateKey) {
  const d = new Date(`${dateKey}T12:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

function formatSlotTime(unixSeconds) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(unixSeconds * 1000))
}

export default function WeatherDashboard({ zip: zipFromBuilder }) {
  const { zip: zipFromRoute } = useParams()
  const zip =
    typeof zipFromBuilder === 'string' && zipFromBuilder.trim() !== ''
      ? zipFromBuilder.trim()
      : zipFromRoute
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cityName, setCityName] = useState('')
  const [dayGroups, setDayGroups] = useState([])

  const canFetch = Boolean(zip && API_KEY)

  useEffect(() => {
    if (!zip) {
      setDayGroups([])
      setCityName('')
      setError(null)
      setLoading(false)
      return
    }
    if (!API_KEY) {
      setDayGroups([])
      setCityName('')
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${encodeURIComponent(
      zip,
    )},us&units=imperial&appid=${API_KEY}`

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: controller.signal })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(body.message || `Forecast request failed (${res.status})`)
        }
        setCityName(body.city?.name ?? '')
        setDayGroups(groupForecastsByDay(body.list ?? []))
      } catch (e) {
        if (e.name === 'AbortError') return
        setError(e.message ?? 'Something went wrong loading the forecast.')
        setDayGroups([])
        setCityName('')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [zip])

  const headingSubtitle = useMemo(() => {
    if (!zip) return 'No ZIP code configured.'
    if (!API_KEY) return 'Add VITE_OPENWEATHER_API_KEY to your environment to load live data.'
    if (cityName) return `${cityName} · ZIP ${zip}`
    return `ZIP ${zip}`
  }, [zip, cityName])

  return (
    <Grid fullWidth>
      <Column sm={4} md={8} lg={16}>
        <Tile>
          <Stack gap={5}>
            <Stack orientation="horizontal" gap={4}>
              <WeatherStation size={32} aria-hidden="true" />
              <Stack gap={2}>
                <Heading>5-day forecast</Heading>
                <p className="cds--type-body-01">{headingSubtitle}</p>
              </Stack>
            </Stack>

            {!zip && (
              <InlineNotification
                kind="info"
                lowContrast
                title="Missing ZIP code"
                subtitle="Use /weather/90210 in the URL, or set the ZIP field on this component in the Builder editor."
                hideCloseButton
              />
            )}

            {zip && !API_KEY && (
              <InlineNotification
                kind="warning"
                lowContrast
                title="OpenWeather API key not configured"
                subtitle="Create a .env file with VITE_OPENWEATHER_API_KEY=your_key and restart the dev server."
                hideCloseButton
              />
            )}

            {canFetch && error && (
              <InlineNotification
                kind="error"
                lowContrast
                title="Could not load forecast"
                subtitle={error}
                hideCloseButton
              />
            )}

            {canFetch && loading && (
              <InlineLoading
                status="active"
                description="Loading forecast…"
                aria-live="assertive"
              />
            )}

            {canFetch && !loading && !error && dayGroups.length > 0 && (
              <Accordion>
                {dayGroups.map(({ dateKey, items }, index) => (
                  <AccordionItem key={dateKey} title={formatDayHeading(dateKey)} open={index === 0}>
                    <Grid narrow condensed>
                      {items.map((slot) => {
                        const w = slot.weather?.[0]
                        const icon = w?.icon
                        const desc = w?.description ?? 'Weather'
                        const temp = slot.main?.temp
                        return (
                          <Column key={slot.dt} sm={2} md={4} lg={4}>
                            <Tile>
                              <Stack gap={3}>
                                <p className="cds--label-01">{formatSlotTime(slot.dt)}</p>
                                {icon && (
                                  <img
                                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                                    alt=""
                                    width={64}
                                    height={64}
                                  />
                                )}
                                <p className="cds--type-body-compact-01">
                                  {typeof temp === 'number' ? `${Math.round(temp)}°F` : '—'}
                                </p>
                                <p className="cds--type-caption-01">{desc}</p>
                              </Stack>
                            </Tile>
                          </Column>
                        )
                      })}
                    </Grid>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Stack>
        </Tile>
      </Column>
    </Grid>
  )
}
