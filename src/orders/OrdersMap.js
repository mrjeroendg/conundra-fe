import React from 'react'
import { Icon as LeafletIcon } from "leaflet";
import { MapContainer, TileLayer, Marker, MapConsumer, Polyline } from 'react-leaflet'

const selectedMarker = new LeafletIcon({
    iconUrl: 'osm/selected-marker.png',
    alt: 'selected',
    iconAnchor: [23, 81]
});

const unselectedMarker = new LeafletIcon({
    iconUrl: 'osm/unselected-marker.png',
    alt: 'unselected',
    iconAnchor: [12, 40]
})

export default function OrdersMap({ orders, selectedOrderId, onToggleOrder }) {
    const mapOrdersToPositions = () => {
        return orders ? orders.map(({ latitude, longitude }) => [latitude, longitude]) : []
    }

    const updateBounds = map => {
        const positions = mapOrdersToPositions()
        positions.length > 0 ? map.fitBounds(positions) : map.fitWorld()
    }

    const getMarkerIcon = orderId => orderId === selectedOrderId ? selectedMarker : unselectedMarker

    return (
        <div className="orders--map">
            {
                <MapContainer style={{ height: "100vh" }} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        orders?.map(order =>
                            <Marker
                                icon={getMarkerIcon(order.id)}
                                position={[order.latitude, order.longitude]}
                                key={order.id}
                                eventHandlers={{
                                    click: () => onToggleOrder(order.id)
                                }}
                            />
                        )
                    }
                    <Polyline pathOptions={{ color: '#cb2d40' }} positions={mapOrdersToPositions()} />
                    <MapConsumer>
                        {(map) => {
                            updateBounds(map)
                            return null
                        }}
                    </MapConsumer>
                </MapContainer>
            }
        </div >
    )
}
