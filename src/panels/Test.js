import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Search from '@vkontakte/icons/dist/24/search';
import Icon24SettingsOutline from '@vkontakte/icons/dist/24/settings';
import Icon24Notifications from '@vkontakte/icons/dist/24/notification';

import persik from '../img/persik.png';

const osName = platform();

const Test = props => (
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
		<div>
            <h1>Test</h1>
        </div>
	</Panel>
);

Test.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Test;
