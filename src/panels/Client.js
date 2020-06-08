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

import persik from '../img/persik.png';
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

const Client = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
			</PanelHeaderButton>}
			right={miniPanel}
		>
			Клиент
		</PanelHeader>
		<Group header={<Header>Мне везут</Header>}>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
				text='Магазин "Развивающие игрушки"'
				caption="03.06.2020"
				after="Везут"
				actions={
					<React.Fragment>
						<Button onClick={props.go} data-to="view_where_courier">Курьер на карте</Button>
						<Button>Чат с курьером</Button>
					</React.Fragment>
				}
			>
				№322356
			</RichCell>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72} />} // src={getAvatarUrl('user_ti')}
				text='Магазин "Автозапчасти"'
				caption="05.06.2020"
				after="Везут"
				actions={
					<React.Fragment>
						<Button>Курьер на карте</Button>
						<Button>Чат с курьером</Button>
					</React.Fragment>
				}
			>
				№789-7890
			</RichCell>
		</Group>
	</Panel>
);

Client.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,

};

export default Client;
