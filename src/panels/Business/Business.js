import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { RichCell, Button, Avatar, PanelSpinner } from '@vkontakte/vkui';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';

import { postSearchOrdersByBusinessID, getBusinessBySocialID } from '../../modules/backRequests'
import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'

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
		await this.getBusiness()
		await this.getBusinessOrders()
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

	render() {
		const props = this.props;
		return (
			<Panel id={props.id}>
				<PanelHeader
					left={<PanelHeaderButton onClick={props.go} data-to="home">
						{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
					</PanelHeaderButton>}
				>
					Бизнес: заказы у курьеров
				</PanelHeader>
				{/* header={<Header>У курьера</Header>} */}
				{!this.state.orders ? <PanelSpinner size='large' /> :  <Group > 
					{this.state.orders && this.state.orders.map((order) =>
						<RichCell key={order.order_number}
							disabled
							multiline
							before={<Avatar size={72} src={order.curier_photo_100}/>} // src={getAvatarUrl('user_ti')}
							text={"Курьер " + order.curier_name}
							caption={fullOrderDate(order)}
							after={orderStateToString(order.order_state)}
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
				</Group>}
			</Panel>
		);
	}
}

Business.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Business;
