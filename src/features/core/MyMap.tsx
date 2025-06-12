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
    const mapRef = useRef<HTMLElement>(null);  // Ref for the map container element
    const googleMapRef = useRef<GoogleMap | null>(null);  // Ref for the GoogleMap instance
    const markersRef = useRef<any[]>([]);  // Ref to store marker objects

    useEffect(() => {
        let canceled = false;

        // Initialize map after the component mounts
        const initializeMap = async () => {
            if (!mapRef.current || canceled) return;

            try {
                const { coords } = await Geolocation.getCurrentPosition();
                const { latitude: lat, longitude: lng } = coords;

                // Create Google Map instance
                if (googleMapRef.current) {
                    await googleMapRef.current.removeAllMapListeners(); // Remove any existing listeners
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

                // Add any pre-existing markers
                if (coordinatesToAdd) {
                    for (let coord of coordinatesToAdd) {
                        await addMarker(coord.lat, coord.long, googleMap);
                    }
                }

                if (googleMap) {
                    // Set up map click listener to add a new marker
                    await googleMap.setOnMapClickListener(async ({ latitude, longitude }) => {
                        await clearAllMarkers(googleMap);  // Clear existing markers
                        await addMarker(latitude, longitude, googleMap);
                        onMapClick && onMapClick({ lat: latitude, long: longitude });
                    });
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        // Add a marker to the map
        const addMarker = async (latitude: number, longitude: number, googleMap: GoogleMap | null) => {
            if (!googleMap) return;
            const marker = await googleMap.addMarker({
                coordinate: { lat: latitude, lng: longitude },
                title: 'My location',
            });
            markersRef.current.push(marker); // Store marker object
            console.log('New marker added', marker);
        };

        // Clear all markers from the map
        const clearAllMarkers = async (googleMap: GoogleMap) => {
            for (const marker of markersRef.current) {
                try {
                    await googleMap.removeMarker(marker);  // Remove each marker
                } catch (err) {
                    console.error('Error removing marker', err);
                }
            }
            markersRef.current = [];  // Clear marker references
            console.log('All markers cleared');
        };

        // Initialize map on component mount
        initializeMap();

        // Cleanup function to remove map listeners on component unmount
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
