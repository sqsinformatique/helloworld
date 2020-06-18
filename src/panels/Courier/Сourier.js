import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderButton, platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { RichCell, Button, Avatar } from '@vkontakte/vkui';

import { postSearchOrdersByCourierID, getCourierBySocialID } from '../../modules/backRequests'
import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'

import './Сourier.css';

const osName = platform();

class Сourier extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fetchedUser: props.fetchedUser,
			user: props.user,
			orders: null,
		};
	}

	async componentDidMount() {
		await this.getCourier()
		await this.getCourierOrders()
	}

	async getCourier() {
		const { fetchedUser } = this.state
		let response = await getCourierBySocialID(fetchedUser.id)
		if (response) {
			this.setState({ user: response })
		}
	}

	async getCourierOrders() {
		const { user } = this.state
		if (!user) {
			return
		}

		let response = await postSearchOrdersByCourierID(user.curier_id)
		if (response) {
			this.setState({ orders: response })
		}
	}

	render() {
		const props = this.props;
		return (
			<Panel id={props.id}>
				<PanelHeader
					left={
						<PanelHeaderButton onClick={props.go} data-to="home">
							{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
						</PanelHeaderButton>
					}
				>
					Курьер
      			</PanelHeader>
				<Group header={<Header>Я везу</Header>}>
					{this.state.orders && this.state.orders.map((order) =>
						<RichCell
							key={order.order_number}
							disabled
							multiline
							before={<Avatar size={72} src={order.photo_100} />} // src={getAvatarUrl('user_ti')}
							text={order.business_name}
							caption={fullOrderDate(order)}
							after={orderStateToString(order.order_state)}
							actions={
								<React.Fragment>
									<Button onClick={(e) => props.go(e, order)} data-to="view_where_client">Адрес на карте</Button>
									<Button>Чат с клиентом</Button>
								</React.Fragment>
							}
						>
							{order.order_number}
						</RichCell>
					)
					}
				</Group>
			</Panel>
		);
	}
}


Сourier.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};


export default Сourier;
