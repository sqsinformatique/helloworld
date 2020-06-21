import React from 'react';
import { YMaps, Map, RoutePanel } from 'react-yandex-maps';

const apiKey = '482da132-c4be-476f-95ef-79ba61d579a4'
const mapState = { center: [55.751574, 37.573856], zoom: 9, controls: ['zoomControl'] };

export function geoMap(clientGeodata, courierGeodata, routingMode) {
    var client
    var courier
    if (typeof clientGeodata === 'object') {
        client = clientGeodata.lat + "," + clientGeodata.long
    } else {
        client = clientGeodata
    }

    if (typeof courierGeodata === 'object') {
        courier = courierGeodata.lat + "," + courierGeodata.long
    } else {
        courier = courierGeodata
    }

    console.log(courierGeodata)

    return <YMaps query={{ apikey: apiKey, load: 'control.ZoomControl' }} >
        <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' >
            {/* <Placemark geometry={[55.684758, 37.738521]} /> */}
            {/* `${userGeodata.lat} +','+ ${userGeodata.long} */}
            <RoutePanel
                instanceRef={ref => {
                    if (ref) {
                        ref.routePanel.state.set({
                            fromEnabled: false,
                            type: routingMode,
                            from: courier,
                            to: client,
                            toEnabled: false,
                        });
                        ref.routePanel.options.set({
                            // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
                            allowSwitch: false,
                            // Включим определение адреса по координатам клика.
                            // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
                            reverseGeocoding: true,
                            // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
                            types: { masstransit: false, pedestrian: false, taxi: false }
                        })
                    }
                }}
                options={{
                    float: 'right',
                }}
            />
        </Map>
    </YMaps>
}