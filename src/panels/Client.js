import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { RichCell, Button, Avatar } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24SettingsOutline from '@vkontakte/icons/dist/24/settings';
import Icon24Notifications from '@vkontakte/icons/dist/24/notification';

import persik from '../img/persik.png';
import './Client.css';

const osName = platform();

const Client = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
			right={
				<React.Fragment>
				  <PanelHeaderButton><Icon24Search /></PanelHeaderButton>
				  <PanelHeaderButton><Icon24SettingsOutline /></PanelHeaderButton>
				  <PanelHeaderButton><Icon24Notifications /></PanelHeaderButton>
				</React.Fragment>
			}
		>
			Клиент
		</PanelHeader>
		<Group header={<Header mode="secondary">Мои заказы</Header>}>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72}  />} // src={getAvatarUrl('user_ti')}
				text='Магазин "Развивающие игрушки"'
				caption="03.06.2020"
				after="Отправлен"
				actions={
				<React.Fragment>
					<Button>Курьер на карте</Button>
					<Button>Чат с курьером</Button>
				</React.Fragment>
				}
				>
				№322356      	
				</RichCell>
			>
		</Group>
	</Panel>
);

Client.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Client;
