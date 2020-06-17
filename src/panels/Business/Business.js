import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { RichCell, Button, Avatar } from '@vkontakte/vkui';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';

import './Business.css';

const osName = platform();

class Business extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fetchedUser:  props.fetchedUser,
			user: props.user,
			orders: null,
		};
	}
	
	async componentDidMount() {
		await this.fetchUser()
		this.getBusinessOrders()
	}

	async fetchUser() {
		let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/business/'

		let response = await fetch(url + this.state.fetchedUser.id);
		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			let json = await response.json();
			this.setState({ user: json.result })
		}
	}

	async getBusinessOrders() {
		if (!this.state.user) {
			return
		}

		const props = this.props;

		console.log(props.user)

		if (!props.user) {
			return
		}

		let requestOrder = [
			{
				business_id: props.user.business_id,
			}
		]
		console.log(requestOrder)

		let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/orders/search'
		let response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(requestOrder)
		});
		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			// получаем тело ответа
			let json = await response.json();
			console.log(json)
			this.setState({ orders: json.result })
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
					left={<PanelHeaderButton onClick={props.go} data-to="home">
						{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
					</PanelHeaderButton>}
				>
					Бизнес
				</PanelHeader>
				<Group header={<Header>У курьера</Header>}>
					{this.state.orders && this.state.orders.map((order) =>
						<RichCell key={order.order_number}
							disabled
							multiline
							before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
							text={"Курьер " + order.curier_name}
							caption={this.fullOrderDate(order)}
							after={this.orderStateToString(order.order_state)}
							actions={
								<React.Fragment>
									<Button onClick={(e) => props.go(e, order)} data-to="view_where_courier_for_business">Курьер на карте</Button>
									<Button>Чат с курьером</Button>
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

Business.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Business;
