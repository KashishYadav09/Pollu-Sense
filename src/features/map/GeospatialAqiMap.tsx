import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useAqiStore } from '../../store/AqiGlobalStore';
import { getAqiBracket } from '../../shared/utils/aqiUtils';
import type { AqiDataRecord } from '../../types/aqi';
import { Layers, MapPin } from 'lucide-react';

// Controller to auto-pan when city changes
const MapRecenter: React.FC<{ selectedCityRecord?: AqiDataRecord | null }> = ({
  selectedCityRecord,
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCityRecord) {
      map.flyTo(
        [selectedCityRecord.latitude, selectedCityRecord.longitude],
        7,
        { duration: 1.2 }
      );
    } else {
      map.flyTo([22.5, 78.9], 5, { duration: 1 });
    }
  }, [selectedCityRecord, map]);

  return null;
};

export const GeospatialAqiMap: React.FC = () => {
  const {
    getLatestCityRecords,
    selectedCity,
    setSelectedCity,
  } = useAqiStore();

  const cityRecords = getLatestCityRecords();

  const selectedRecord =
    selectedCity !== 'ALL'
      ? cityRecords.find(
          (c) => c.city.toLowerCase() === selectedCity.toLowerCase()
        )
      : null;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-3 relative h-[440px] xl:h-[480px]">
      {/* Map Header Overlay */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Interactive Geospatial AQI Heatmap
            </h2>
            <p className="text-xs text-slate-400">
              Real-time spatial distribution across Indian metropolitan zones
            </p>
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] bg-slate-100/90 px-3.5 py-1.5 rounded-2xl border border-slate-200/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-medium">&lt;50 Good</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-medium">51-100 Mod</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-slate-700 font-medium">101-200 Poor</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 font-medium">&gt;200 Haz</span>
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-200">
        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapRecenter selectedCityRecord={selectedRecord} />

          {cityRecords.map((cityRec) => {
            const bracket = getAqiBracket(cityRec.aqi);
            const isSelected =
              selectedCity.toLowerCase() === cityRec.city.toLowerCase();

            // Scaled formula to prevent circle marker overlap and keep map clear
            const pollutantValue = (cityRec as unknown as { pollutant_avg?: number }).pollutant_avg ?? cityRec.aqi;
            const markerRadius = Math.max(4, Math.min(10, pollutantValue / 15));

            return (
              <CircleMarker
                key={cityRec.id}
                center={[cityRec.latitude, cityRec.longitude]}
                radius={isSelected ? markerRadius + 3 : markerRadius}
                pathOptions={{
                  color: isSelected ? '#000000' : bracket.color,
                  fillColor: bracket.color,
                  fillOpacity: isSelected ? 0.95 : 0.75,
                  weight: isSelected ? 2.5 : 1,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(cityRec.city);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs font-sans font-bold text-slate-800">
                    {cityRec.city}: <span style={{ color: bracket.color }}>{cityRec.aqi} AQI</span> ({bracket.category})
                  </div>
                </Tooltip>

                <Popup>
                  <div className="p-3.5 text-slate-800 w-52 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{cityRec.city}</h4>
                        <span className="text-[10px] text-slate-400">{cityRec.state}</span>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: `${bracket.color}15`,
                          color: bracket.color,
                          border: `1px solid ${bracket.color}40`,
                        }}
                      >
                        {cityRec.aqi} AQI
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="font-bold" style={{ color: bracket.color }}>
                          {bracket.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">PM2.5:</span>
                        <span className="text-slate-800 font-mono font-semibold">{cityRec.pm25} µg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">PM10:</span>
                        <span className="text-slate-800 font-mono font-semibold">{cityRec.pm10} µg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">NO₂ / SO₂:</span>
                        <span className="text-slate-800 font-mono font-semibold">{cityRec.no2} / {cityRec.so2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dominant:</span>
                        <span className="text-amber-600 font-bold">{cityRec.dominantPollutant}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCity(cityRec.city)}
                      className="mt-3 w-full py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                    >
                      Filter Trends for {cityRec.city}
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur px-3.5 py-1.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-medium pointer-events-none flex items-center gap-2 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-slate-600" />
          <span>Click any marker to inspect regional sensor telemetry</span>
        </div>
      </div>
    </div>
  );
};
