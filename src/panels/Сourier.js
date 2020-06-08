import React from 'react';
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
			fetchedUser: null,
		};

	}

	getCourierOrders() {
		const clientOrders = [
			{
				"shop": 'Магазин "Развивающие игрушки"',
				"date": '06.06.2020',
				"state": 'Везут',
				"number": '5488779',
				"target": 'Москва, ул. Братиславская, д. 31к1',
				"courier_id": 123,
			},
			{
				"shop": 'Магазин "Автозапчасти"',
				"date": '08.06.2020',
				"state": 'Везут',
				"number": '34643-643',
				"target": 'Москва, ул. Братиславская, д. 31к1',
				"courier_id": 124,
			},
		]
		return clientOrders
	}

	render() {
		const props = this.props;
		return (
			<Panel id={props.id}>
				<PanelHeader
					noShadow left={
						<PanelHeaderButton onClick={props.go} data-to="home">
							{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
						</PanelHeaderButton>
					}
				>
					Курьер
      			</PanelHeader>
				<Group header={<Header>Мне везут</Header>}>
					{this.getCourierOrders().map((order) =>
						<RichCell
							disabled
							multiline
							before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
							text={order.shop}
							caption={order.date}
							after={order.state}
							actions={
								<React.Fragment>
									<Button onClick={(e) => props.go(e, order)} data-to="view_where_client">Адрес на карте</Button>
									<Button>Чат с клиентом</Button>
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


Сourier.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};


export default Сourier;
