import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useRef } from 'react';
import { mapsApiKey } from './mapsApiKey';

interface MyMapProps {
    onMapClick?: (e: any) => void;
    coordinatesToAdd?: coordinatesInterface[];
}

interface coordinatesInterface {
    lat: number;
    long: number;
}

const MyMap: React.FC<MyMapProps> = ({ onMapClick, coordinatesToAdd }) => {
    const mapRef = useRef<HTMLElement>(null);
    const googleMapRef = useRef<GoogleMap | null>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        let canceled = false;


        const initializeMap = async () => {
            if (!mapRef.current || canceled) return;

            try {
                const { coords } = await Geolocation.getCurrentPosition();
                const { latitude: lat, longitude: lng } = coords;


                if (googleMapRef.current) {
                    await googleMapRef.current.removeAllMapListeners();
                    googleMapRef.current = null;
                }

                googleMapRef.current = await GoogleMap.create({
                    id: 'my-cool-map',
                    element: mapRef.current,
                    apiKey: mapsApiKey,
                    config: {
                        center: { lat, lng },
                        zoom: 8,
                    },
                });

                console.log('Map initialized');

                const googleMap = googleMapRef.current;

                if (coordinatesToAdd) {
                    for (let coord of coordinatesToAdd) {
                        await addMarker(coord.lat, coord.long, googleMap);
                    }
                }

                if (googleMap) {
                    await googleMap.setOnMapClickListener(async ({ latitude, longitude }) => {
                        await clearAllMarkers(googleMap);
                        await addMarker(latitude, longitude, googleMap);
                        onMapClick && onMapClick({ lat: latitude, long: longitude });
                    });
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };


        const addMarker = async (latitude: number, longitude: number, googleMap: GoogleMap | null) => {
            if (!googleMap) return;
            const marker = await googleMap.addMarker({
                coordinate: { lat: latitude, lng: longitude },
                title: 'My location',
            });
            markersRef.current.push(marker);
            console.log('New marker added', marker);
        };


        const clearAllMarkers = async (googleMap: GoogleMap) => {
            for (const marker of markersRef.current) {
                try {
                    await googleMap.removeMarker(marker);
                } catch (err) {
                    console.error('Error removing marker', err);
                }
            }
            markersRef.current = [];
            console.log('All markers cleared');
        };


        initializeMap();


        return () => {
            canceled = true;
            if (googleMapRef.current) {
                googleMapRef.current.removeAllMapListeners();
            }
        };
    }, [coordinatesToAdd, onMapClick]);

    return (
        <div className="component-wrapper">
            <capacitor-google-map
                ref={mapRef}
                style={{
                    display: 'block',
                    height: 400,
                }}
            ></capacitor-google-map>
        </div>
    );
};

export default MyMap;
