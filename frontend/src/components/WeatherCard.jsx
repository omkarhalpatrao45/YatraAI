import { CloudSun, Droplets, Thermometer, Wind } from 'lucide-react'
import Card from './Card'

function readNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number) : 'N/A'
}

export default function WeatherCard({ weather, destination }) {
  if (!weather) {
    return (
      <Card className="p-6 text-center">
        <CloudSun className="mx-auto mb-3 h-10 w-10 text-gray-300" />
        <p className="font-medium text-gray-500">Weather is unavailable for {destination}</p>
        <p className="mt-1 text-xs text-gray-400">The backend weather service did not return a forecast.</p>
      </Card>
    )
  }

  const metrics = [
    { icon: Droplets, label: 'Humidity', value: `${weather.humidity ?? 'N/A'}%`, color: 'text-blue-500' },
    { icon: Wind, label: 'Wind', value: `${weather.wind_speed ?? 'N/A'} m/s`, color: 'text-green-500' },
    { icon: Thermometer, label: 'Feels like', value: `${readNumber(weather.feels_like)} C`, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-textDark">{weather.city || destination}{weather.country ? `, ${weather.country}` : ''}</h3>
            <p className="text-sm capitalize text-gray-500">{weather.description || 'Current conditions'}</p>
            <p className="mt-3 text-4xl font-bold text-primary sm:text-5xl">{readNumber(weather.temperature)} C</p>
          </div>
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description || 'Weather icon'}
              className="h-20 w-20"
            />
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
          {metrics.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-lg bg-gray-50 p-3 text-center">
              <Icon className={`mx-auto mb-1 h-5 w-5 ${color}`} />
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-textDark">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {weather.forecast?.length > 0 && (
        <Card className="p-5">
          <h4 className="mb-4 font-semibold text-textDark">5-Day Forecast</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {weather.forecast.slice(0, 5).map(day => (
              <div key={day.date} className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-xs font-medium text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                {day.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.description || 'Forecast icon'}
                    className="mx-auto h-10 w-10"
                  />
                )}
                <p className="text-sm font-semibold text-primary">{readNumber(day.temp_max)} C</p>
                <p className="text-xs text-gray-400">{readNumber(day.temp_min)} C</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
