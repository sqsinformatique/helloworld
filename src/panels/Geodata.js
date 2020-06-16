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
            {/* <Placemark geometry={[55.684758, 37.738521]} /> */}
            {/* `${userGeodata.lat} +','+ ${userGeodata.long} */}
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

class GeodataClient extends React.Component {
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
        this.setState({ courier_id: props.order.curier_id })

        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/curiers/geo/'
        let response = await fetch(url + props.order.curier_id);
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            let json = await response.json();
            this.setState({ courier_geodata: { lat: json.result.lat, long: json.result.long } })
        }

        // возвращаем с бека координаты курьера
        // пока заглушка
        // this.setState({ courier_geodata: { lat: 55.659200, long: 37.753314 } })
    }

    async fetchCourierGeo() {
        if (this.state.courier_id > 0) {

            let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/curiers/geo/'
            let response = await fetch(url + this.state.courier_id);
            if (response.ok) { // если HTTP-статус в диапазоне 200-299
                let json = await response.json();
                this.setState({ courier_geodata: {lat: json.result.lat, long: json.result.long} })
            }
            //     // возвращаем с бека координаты курьера
            //     // пока заглушка
            //     this.setState({
            //         courier_geodata: {
            //             lat: this.state.courier_geodata.lat + 0.00001,
            //             long: this.state.courier_geodata.long + 0.00001
            //         }
            //     })
        }
    }

    fullOrderDate(order) {
        return order.order_date + " с " + order.order_time_begin + " до " + order.order_time_end
    }

    orderStateToString(state) {
        switch (state) {
            case 'to_delivery':
                return 'В доставке'
            default:
                return 'Не известное состояние'
        }
    }

    render() {
        const props = this.props;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="client">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                    Курьер на карте
                </PanelHeader>
                <RichCell
                    disabled
                    multiline
                    before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
                    text={props.order.business_name}
                    caption={this.fullOrderDate(props.order)}
                    after={this.orderStateToString(props.order.order_state)}
                    actions={
                        <React.Fragment>
                            <Button>Чат с курьером</Button>
                        </React.Fragment>
                    }
                >
                    {props.order.order_number}
                </RichCell>
                {geoMap(props.order.order_address, this.state.courier_geodata)}
            </Panel>
        )
    }
}

GeodataClient.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default GeodataClient;