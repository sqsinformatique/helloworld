import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderButton, platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { RichCell, Button, Avatar } from '@vkontakte/vkui';

import './Сourier.css';

const osName = platform();

class Сourier extends React.Component {
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
		this.getCourierOrders()
	}

	// Проверяем, есть ли такой пользователь у нас на бэке
	async fetchUser() {
		let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/curiers/'

		let response = await fetch(url + this.state.fetchedUser.id);
		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			let json = await response.json();
			this.setState({ user: json.result })
		}
	}

	async getCourierOrders() {
		const props = this.props;

		console.log(props.user)

		let requestOrder = [
			{
				curier_id: "+" + props.user.curier_id,
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

	orderStateToString(state) {
		switch (state) {
			case 'to_delivery':
				return 'В доставке'
			default:
				return 'Не известное состояние'
		}
	}

	fullOrderDate(order) {
		return order.order_date + " с " + order.order_time_begin + " до " + order.order_time_end
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
							before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
							text={order.business_name}
							caption={this.fullOrderDate(order)}
							after={this.orderStateToString(order.order_state)}
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
