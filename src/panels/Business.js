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
			fetchedUser: null,
		};
	}

	getBusinessOrders() {
		const businessOrders = [
			{
				"shop": 'Магазин "Развивающие игрушки"',
				"date": '06.06.2020',
				"state": 'Везут',
				"number": '5488779',
				"target": 'Москва, ул. Братиславская, д. 31к1',
				"courier_id": 123,
				"courier_name": 'Иванов Виктор',
			},
			{
				"shop": 'Магазин "Автозапчасти"',
				"date": '08.06.2020',
				"state": 'Везут',
				"number": '34643-643',
				"target": 'Москва, ул. Братиславская, д. 31к1',
				"courier_id": 124,
				"courier_name": 'Равшан Ильюсович',
			},
		]
		return businessOrders
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
					{this.getBusinessOrders().map((order) =>
						<RichCell key={order.number}
							disabled
							multiline
							before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
							text={"Курьер " + order.courier_name}
							caption={order.date}
							after={order.state}
							actions={
								<React.Fragment>
									<Button onClick={(e) => props.go(e, order)} data-to="view_where_courier_for_business">Курьер на карте</Button>
									<Button>Чат с курьером</Button>
								</React.Fragment>
							}
						>
							{order.number}
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
