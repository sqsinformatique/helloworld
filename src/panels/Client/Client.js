import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { PanelHeader, Header, RichCell, Button, Avatar } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24SettingsOutline from '@vkontakte/icons/dist/24/settings';
import Icon24Notifications from '@vkontakte/icons/dist/24/notification';
import bridge from '@vkontakte/vk-bridge';

import './Client.css';

const osName = platform();

var miniPanel;
if (osName !== IOS || osName !== ANDROID) {
	miniPanel = <React.Fragment>
		<PanelHeaderButton><Icon24Search /></PanelHeaderButton>
		<PanelHeaderButton><Icon24SettingsOutline /></PanelHeaderButton>
		<PanelHeaderButton><Icon24Notifications /></PanelHeaderButton>
	</React.Fragment>
}

class Client extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fetchedUser: props.fetchedUser,
			orders: null,
			user: props.user,
		};

		console.log("user client", this.state.fetchedUser)
	}

	async componentDidMount() {
		await this.fetchUser()
		this.getClientOrders()
	}

	async fetchUser() {
		let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/clients/'

		let response = await fetch(url + this.state.fetchedUser.id);
		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			let json = await response.json();
			this.setState({ user: json.result })
			console.log(this.state.user)
		}
	}

	async getClientOrders() {
		const props = this.props;

		// const userPhone = await bridge.send("VKWebAppGetPhoneNumber", {});
		// console.log(userPhone)

		let requestOrder = [
			{
				hash_telephone: this.state.user.hash_telephone,
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
					left={<PanelHeaderButton onClick={props.go} data-to="home">
						{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
					</PanelHeaderButton>}
				// right={miniPanel}
				>
					Клиент
					</PanelHeader>
				<Group header={<Header>Мне везут</Header>}>
					{this.state.orders && this.state.orders.map((order) =>
						<RichCell
							key={order.order_number}
							disabled
							multiline
							before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
							text={"Отправитель: "+order.business_name}
							caption={this.fullOrderDate(order)}
							after={this.orderStateToString(order.order_state)}
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
				</Group>
			</Panel>
		);
	}
}

Client.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

export default Client;
