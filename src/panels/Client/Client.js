import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { PanelHeader, Header, RichCell, Button, Avatar, PanelSpinner } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { postSearchOrdersByClientHashPhone, getClientBySocialID } from '../../modules/backRequests'
import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'

import './Client.css';

const osName = platform();
// var miniPanel;
// if (osName !== IOS || osName !== ANDROID) {
// 	miniPanel = <React.Fragment>
// 		<PanelHeaderButton><Icon24Search /></PanelHeaderButton>
// 		<PanelHeaderButton><Icon24SettingsOutline /></PanelHeaderButton>
// 		<PanelHeaderButton><Icon24Notifications /></PanelHeaderButton>
// 	</React.Fragment>
// }

class Client extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fetchedUser: props.fetchedUser,
			orders: null,
			user: props.user,
		};
	}

	async componentDidMount() {
		await this.getClient()
		await this.getClientOrders()
	}

	async getClient() {
		const { fetchedUser } = this.state
		let response = await getClientBySocialID(fetchedUser.id)
		if (response) {
			this.setState({ user: response })
		}
	}

	async getClientOrders() {
		const { user } = this.state
		if (!user) {
			return
		}

		let response = await postSearchOrdersByClientHashPhone(user.hash_telephone)
		if (response) {
			this.setState({ orders: response })
		}
	}

	render() {
		const props = this.props;
		return (
			<Panel id={props.id}>
				<PanelHeader
					left={<PanelHeaderButton onClick={props.go} data-to="home">
						{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
					</PanelHeaderButton>}
				// right={miniPanel}
				>
					Клиент: мне везут
					</PanelHeader>
					{/* header={<Header>Мне везут</Header>} */}
				
				{!this.state.orders ? <PanelSpinner size='large' /> : <Group >
					{this.state.orders && this.state.orders.map((order) =>
						<RichCell
							key={order.order_number}
							disabled
							multiline
							before={<Avatar size={72} src={order.photo_100} />} // src={getAvatarUrl('user_ti')}
							text={"Отправитель: " + order.business_name}
							caption={fullOrderDate(order)}
							after={orderStateToString(order.order_state)}
							actions={
								<React.Fragment>
									<Button onClick={(e) => props.go(e, order)} data-to="view_where_courier">Курьер на карте</Button>
									<Button>Чат с курьером</Button>
								</React.Fragment>
							}
						>
							{order.order_number}
						</RichCell>
					)
					}
				</Group>}
			</Panel>
		);
	}
}

Client.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Client;
