import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel } from '@vkontakte/vkui';
import { YMaps, Map, RoutePanel } from 'react-yandex-maps';
import { PanelHeader, Header, RichCell, Button, Avatar } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';


const mapState = { center: [55.751574, 37.573856], zoom: 9, controls: ['zoomControl'] };

const osName = platform();

function geoMap(clientGeodata, courierGeodata) {
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

    return <YMaps query={{ apikey: '482da132-c4be-476f-95ef-79ba61d579a4', load: 'control.ZoomControl' }} >
        <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' >
            <RoutePanel
                instanceRef={ref => {
                    if (ref) {
                        ref.routePanel.state.set({
                            fromEnabled: false,
                            type: 'masstransit',
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

class GeodataCourier extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courier_id: -1,
            courier_geodata: { lat: 55.659200, long: 37.753314 },
        };

        this.state.geoUpdateInterval = setInterval(() => {
            this.fetchCourierGeo()
        }, 5000);
    }

    async componentDidMount() {
        const props = this.props;
        this.setState({ courier_id: props.order.courier_id })

        // получаем координаты курьера
        // const geodata = await bridge.send('VKWebAppGetGeodata');
        // this.setState({ courier_geodata: geodata });

        // пока заглушка
        this.setState({
            courier_geodata: {
                lat: 55.659200,
                long: 37.753314
            }
        })

        // отправляем координаты курьера на бек
    }

    async fetchCourierGeo() {
        if (this.state.courier_id > 0) {
            // получаем координаты курьера
            // const geodata = await bridge.send('VKWebAppGetGeodata');
            // this.setState({ courier_geodata: geodata });

            // пока заглушка
            this.setState({
                courier_geodata: {
                    lat: this.state.courier_geodata.lat + 0.00001,
                    long: this.state.courier_geodata.long + 0.00001
                }
            })

            // отправляем координаты курьера на бек
        }
    }

    render() {
        const props = this.props;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="courier">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                    {props.order.shop}
                </PanelHeader>
                <RichCell
                    disabled
                    multiline
                    before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
                    text=''
                    caption={props.order.date}
                    after={props.order.state}
                    actions={
                        <React.Fragment>
                            <Button>Чат с клиентом</Button>
                        </React.Fragment>
                    }
                >
                    {props.order.number}
                </RichCell>
                {geoMap(props.order.target, this.state.courier_geodata)}
            </Panel>
        )
    }
}

GeodataCourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default GeodataCourier;