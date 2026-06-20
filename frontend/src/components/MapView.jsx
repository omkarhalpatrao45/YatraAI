import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import Card from './Card'
import LoadingSpinner from './LoadingSpinner'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function RecenterMap({ coords }) {
  const map = useMap()

  useEffect(() => {
    if (coords) map.setView(coords, 12)
  }, [coords, map])

  return null
}

export default function MapView({ destination, days = [], height = 380 }) {
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!destination) return

    const controller = new AbortController()
    const city = destination.split(',')[0].trim()

    setCoords(null)
    setError('')

    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
      signal: controller.signal,
    })
      .then(response => response.json())
      .then(data => {
        if (data?.length) {
          setCoords([Number(data[0].lat), Number(data[0].lon)])
        } else {
          setError('Location not found on the map.')
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError('Failed to load map data.')
      })

    return () => controller.abort()
  }, [destination])

  if (error) return <Card className="p-6 text-center text-gray-500 dark:text-zinc-400">{error}</Card>
  if (!coords) return <Card className="p-6"><LoadingSpinner label="Loading map" /></Card>

  const places = days.flatMap(day => day.places?.slice(0, 1) || []).slice(0, 5)

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 dark:border-zinc-700 p-4">
        <h3 className="font-semibold text-textDark">{destination}</h3>
        <p className="text-xs text-gray-400 dark:text-zinc-400">Destination marker and nearby itinerary context</p>
      </div>
      <div style={{ height }}>
        <MapContainer center={coords} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap coords={coords} />
          <Marker position={coords}>
            <Popup>
              <strong>{destination}</strong>
              <br />
              Trip destination
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      {places.length > 0 && (
        <div className="border-t border-gray-100 dark:border-zinc-700 p-4">
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-zinc-400">Key Places</p>
          <div className="flex flex-wrap gap-2">
            {places.map(place => (
              <span key={place} className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-1 text-xs text-primary dark:text-blue-300">
                {place}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
