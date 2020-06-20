import React from 'react';
import { Panel } from '@vkontakte/vkui';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { PanelHeader  } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { postSearchOrdersByBusinessID, getBusinessBySocialID } from '../../modules/backRequests'

const mapState = { center: [55.751574, 37.573856], zoom: 9, controls: ['zoomControl'] };

const osName = platform();

class BusinessAllCourier extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser:  props.fetchedUser,
            orders: null,
            ymaps: null,
            user: props.user,
        };

        this.state.geoUpdateInterval = setInterval(() => {
            this.getBusinessOrders()
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

    async componentDidMount() {
		await this.getBusiness()
		await this.getBusinessOrders()
    }
    
    componentWillUnmount() {
        clearInterval(this.state.geoUpdateInterval)
    }

	async getBusiness() {
		const { fetchedUser } = this.state
		let response = await getBusinessBySocialID(fetchedUser.id)
		if (response) {
			this.setState({ user: response })
		}
	}

	async getBusinessOrders() {
		const { user } = this.state
		if (!user) {
			return
		}

		let response = await postSearchOrdersByBusinessID(user.business_id)
		if (response) {
			this.setState({ orders: response })
		}
    }
    
    detailClick() {
        alert("test")
        console.log("test")
    }

    render() {
        const props = this.props;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="home">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                    Бизнес: курьеры на карте 
                </PanelHeader>
                <YMaps query={{ apikey: '482da132-c4be-476f-95ef-79ba61d579a4', load: ['util.bounds', 'control.ZoomControl'] }} >
                    <Map width="100vw" height="100vh" defaultState={mapState} className='mapview' onLoad={ymaps => this.setYmaps(ymaps)}>
                        {this.state.orders && this.state.orders.map((order) =>
                            <Placemark key={order.order_number} properties={{
                                hintContent: order.curier_name,
                                properties: { name: "test" },
                                balloonContent: '<div style="margin: 10px;">' +
                                    '<b>' + order.curier_name + '</b><br /> Заказ: ' + order.order_number + '<br />' +
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