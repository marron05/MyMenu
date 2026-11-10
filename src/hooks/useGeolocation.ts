import { useState, useEffect, useCallback } from 'react';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export type GeolocationStatus = 'idle' | 'prompt' | 'granted' | 'denied' | 'error';

// Default central coordinate: Lechería, Anzoátegui (Plaza Mayor / Lido area)
export const LECHERIA_DEFAULT_COORDS: UserCoordinates = {
  latitude: 10.1982,
  longitude: -64.6854,
};

/**
 * Calculates Haversine distance in kilometers between two geographic coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 1 decimal place (e.g. 0.8 km)
  return Math.round(distance * 10) / 10;
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<UserCoordinates>(LECHERIA_DEFAULT_COORDS);
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingRealGps, setIsUsingRealGps] = useState<boolean>(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('denied');
      setErrorMessage('La geolocalización no está soportada por este navegador');
      return;
    }

    setStatus('prompt');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('granted');
        setIsUsingRealGps(true);
        setErrorMessage(null);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setStatus('denied');
        setErrorMessage(error.message);
        setIsUsingRealGps(false);
        // Fallback to Lechería default
        setCoordinates(LECHERIA_DEFAULT_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Request on initial load if supported and permissions granted
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            requestLocation();
          } else if (result.state === 'prompt') {
            setStatus('prompt');
          } else {
            setStatus('denied');
          }
        })
        .catch(() => {
          // Fallback if query not supported
          requestLocation();
        });
    } else {
      requestLocation();
    }
  }, [requestLocation]);

  return {
    coordinates,
    status,
    errorMessage,
    isUsingRealGps,
    requestLocation,
    calculateDistanceFromUser: (lat: number, lng: number) =>
      calculateDistanceKm(coordinates.latitude, coordinates.longitude, lat, lng),
  };
}
