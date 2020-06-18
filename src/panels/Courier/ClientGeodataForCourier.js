import React from 'react';
import { Panel } from '@vkontakte/vkui';
import { PanelHeader, RichCell, Button, Avatar } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'
import { geoMap } from '../../modules/map'

const osName = platform();

class ClientGeodataForCourier extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courier_id: props.order.courier_id,
            courier_geodata: props.courier_geodata,
        };
    }

    async componentDidMount() {
        const props = this.props;
        this.setState({ courier_id: props.order.courier_id, courier_geodata: props.courier_geodata })

        console.log("courier_geodata", props.courier_geodata)
    }

    render() {
        const { id, order, courier_geodata } = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="courier">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                    {order.shop}
                </PanelHeader>
                <RichCell
                    key={order.order_number}
                    disabled
                    multiline
                    before={<Avatar size={72} src={order.photo_100} />} // src={getAvatarUrl('user_ti')}
                    text=''
                    caption={fullOrderDate(order)}
                    after={orderStateToString(order.order_state)}
                    actions={
                        <React.Fragment>
                            <Button>Чат с клиентом</Button>
                        </React.Fragment>
                    }
                >
                    {order.order_number}
                </RichCell>
                {geoMap(order.order_address, courier_geodata)}
            </Panel>
        )
    }
}

ClientGeodataForCourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default ClientGeodataForCourier;