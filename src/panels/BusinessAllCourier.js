import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel } from '@vkontakte/vkui';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { PanelHeader, Header, RichCell, Button, Avatar } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';


const mapState = { center: [55.751574, 37.573856], zoom: 9, controls: ['zoomControl'] };

const osName = platform();

function geoMap(ordes) {
    return <YMaps query={{ apikey: '482da132-c4be-476f-95ef-79ba61d579a4', load: 'control.ZoomControl' }} >
        <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' onLoad={ymaps => this.setYmaps(ymaps)}>
            <Placemark geometry={[55.684758, 37.738521]} />
            <Placemark geometry={[55.684858, 37.738921]} />
        </Map>
    </YMaps>
}

class BusinessAllCourier extends React.Component {
    constructor(props) {
        super(props);

        var orders = this.fetchOrdersWithGeo(props.business_id)

        this.state = {
            business_id: props.business_id,
            orders: orders,
            ymaps: null,
        };

        this.state.geoUpdateInterval = setInterval(() => {
            this.fetchOrdersWithGeo(props.business_id)
        }, 5000);
    }

    setYmaps = ymaps => {
        this.setState({ ymaps });
    };

    setCenter = ref => {
        const { ymaps } = this.state;

        if (ymaps) {
            const map = ref.getMap();
            const result = ymaps.util.bounds.getCenterAndZoom(
                map.geoObjects.getBounds(),
                map.container.getSize()
            );

            // Setting the optimal center and zoom level of the map.
            var zoom = result.zoom
            if (result.zoom > 19) {
                zoom = 19
            }
            map.setCenter(result.center, zoom);
        }
    };

    // async componentDidMount() {
    //     const props = this.props;
    //     this.setState({ business_id: props.business_id })
    //     console.log("mount")
    // }

    fetchOrdersWithGeo(id) {
        if (this.state && this.state.orders) {
            this.state.orders[0].geodata.lat = this.state.orders[0].geodata.lat + 0.0001
            this.state.orders[0].geodata.long = this.state.orders[0].geodata.long + 0.0001
            this.setState({ orders: this.state.orders })
        } else {
            return [
                {
                    "shop": 'Магазин "Развивающие игрушки"',
                    "date": '06.06.2020',
                    "state": 'Везут',
                    "number": '5488779',
                    "target": 'Москва, ул. Братиславская, д. 31к1',
                    "courier_id": 123,
                    "courier_name": 'Иванов Виктор',
                    "geodata": { lat: 55.659200, long: 37.753314 }
                },
                {
                    "shop": 'Магазин "Развивающие игрушки"',
                    "date": '08.06.2020',
                    "state": 'Везут',
                    "number": '34643-643',
                    "target": 'Москва, ул. Братиславская, д. 31к1',
                    "courier_id": 124,
                    "courier_name": 'Равшан Ильюсович',
                    "geodata": { lat: 55.659209, long: 37.753434 }
                },
            ]
        }
    }

    detailClick() {
        alert("test")
        console.log("test")
    }

    render() {
        console.log("render")

        const props = this.props;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="business">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                    Курьеры {props.business_name}
                </PanelHeader>
                <YMaps query={{ apikey: '482da132-c4be-476f-95ef-79ba61d579a4', load: ['util.bounds', 'control.ZoomControl'] }} >
                    <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' onLoad={ymaps => this.setYmaps(ymaps)}>
                        {this.state.orders && this.state.orders.map((order) =>
                            <Placemark key={order.number} properties={{
                                hintContent: order.courier_name,
                                properties: { name: "test" },
                                balloonContent: '<div style="margin: 10px;">' +
                                    '<b>' + order.courier_name + '</b><br /> Заказ: ' + order.number + '<br />' +
                                    '<i id="count"></i> ' +
                                    // '<input type="button" onclick="this.detailClick()" value="Считать кроликов!"/>' +
                                    '</div>',
                            }} modules={['geoObject.addon.balloon', 'geoObject.addon.hint']} geometry={[order.geodata.lat, order.geodata.long]} instanceRef={ref => ref && this.setCenter(ref)} />
                        )}
                    </Map>
                </YMaps>
            </Panel>
        )
    }
}

BusinessAllCourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default BusinessAllCourier;