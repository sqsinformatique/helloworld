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

const Business = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Бизнес
		</PanelHeader>
		<Group header={<Header>Заказы</Header>}>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72}  />} // src={getAvatarUrl('user_ti')}
				text='Курьер Иванов Виктор'
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
			<RichCell
				disabled
				multiline
				before={<Avatar size={72}  />} // src={getAvatarUrl('user_ti')}
				text='Курьер Равшан Ильюсович'
				caption="05.06.2020"
				after="Отправлен"
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

Business.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Business;
