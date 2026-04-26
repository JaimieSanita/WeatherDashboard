import { Builder, builder } from '@builder.io/react'
import WeatherDashboard from './WeatherDashboard.jsx'

const builderPublicApiKey = import.meta.env.VITE_BUILDER_PUBLIC_API_KEY

if (builderPublicApiKey) {
  builder.init(builderPublicApiKey)
}

Builder.registerComponent(WeatherDashboard, {
  name: 'WeatherDashboard',
  friendlyName: 'Weather dashboard',
  inputs: [
    {
      name: 'zip',
      type: 'text',
      friendlyName: 'ZIP code',
      helperText: 'US ZIP code for the OpenWeather 5-day forecast.',
      defaultValue: '90210',
    },
    {
      name: 'unit',
      type: 'string',
      friendlyName: 'Temperature unit',
      helperText: 'Choose Fahrenheit (Imperial) or Celsius (Metric).',
      defaultValue: 'imperial',
      enum: [
        { label: 'Imperial (°F)', value: 'imperial' },
        { label: 'Metric (°C)', value: 'metric' },
      ],
    },
  ],
})
