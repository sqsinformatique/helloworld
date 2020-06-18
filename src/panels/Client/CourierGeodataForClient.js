import React from 'react';
import { Panel } from '@vkontakte/vkui';
import { PanelHeader, RichCell, Button, Avatar } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'
import { getCourierGeodataByCourierID } from '../../modules/backRequests'
import { geoMap } from '../../modules/map'

const osName = platform();

class CourierGeodataForClient extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courier_id: this.props.order.curier_id,
            courier_geodata: { lat: 55.659200, long: 37.753314 },
        };

        this.state.geoUpdateInterval = setInterval(() => {
            this.fetchCourierGeo()
        }, 5000);
    }

    async componentDidMount() {
        await this.fetchCourierGeo()
    }

    componentWillUnmount() {
        clearInterval(this.state.geoUpdateInterval)
    }

    async fetchCourierGeo() {
        const { courier_id } = this.state;
        const response = await getCourierGeodataByCourierID(courier_id)
        if (response) {
            this.setState({ courier_geodata: { lat: response.lat, long: response.long } })
        }
    }

    render() {
        const { id, order } = this.props;
        return (
            <Panel id={id}>
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
                    before={<Avatar size={72} src={order.curier_photo_100} />} // src={getAvatarUrl('user_ti')}
                    text={order.business_name}
                    caption={fullOrderDate(order)}
                    after={orderStateToString(order.order_state)}
                    actions={
                        <React.Fragment>
                            <Button>Чат с курьером</Button>
                        </React.Fragment>
                    }
                >
                    {order.order_number}
                </RichCell>
                {geoMap(order.order_address, this.state.courier_geodata)}
            </Panel>
        )
    }
}

CourierGeodataForClient.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default CourierGeodataForClient;