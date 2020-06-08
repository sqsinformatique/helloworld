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
            shop: 'unknown shop',
            date: '01.01.1970',
            state: 'unknown',
            number: '-1',
            target: 'unknown',
            geodata: { lat: 37.609218, long: 55.753559 }, // центр Москвы :)
        };

        this.state.geoUpdateInterval = setInterval(() => {
            // const geodata = bridge.send('VKWebAppGetGeodata');
            // this.setState({ geodata: geodata });
            console.log(this.state.geodata)
            this.setState({ geodata: { lat: this.state.geodata.lat + 0.00001, long: this.state.geodata.long + 0.00001 } })
        }, 5000);
    }

    async componentDidMount() {
        const geodata = await bridge.send('VKWebAppGetGeodata');
        this.setState({ geodata: geodata });
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
                    {this.state.shop}
                </PanelHeader>
                <RichCell
                    disabled
                    multiline
                    before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
                    text=''
                    caption={this.state.date}
                    after={this.state.state}
                    actions={
                        <React.Fragment>
                            <Button>Чат с курьером</Button>
                        </React.Fragment>
                    }
                >
                    {this.state.number}
                </RichCell>
                {geoMap("Москва, Братиславская ул, 31к1", this.state.geodata)}
            </Panel>
        )
    }
}

GeodataClient.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default GeodataClient;