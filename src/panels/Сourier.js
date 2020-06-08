import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderButton, platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Geodata from './Geodata'
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import { RichCell, Button, Avatar } from '@vkontakte/vkui';

import './Сourier.css';

const osName = platform();

const Сourier = props => (
    <Panel id={props.id}>
      <PanelHeader
        noShadow left={
          <PanelHeaderButton onClick={props.go} data-to="home">
          {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
          </PanelHeaderButton>
        }
      >
        Курьер
      </PanelHeader>
      <Group header={<Header>Мои активные заказы</Header>}>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72}  />} // src={getAvatarUrl('user_ti')}
				text='Магазин "Развивающие игрушки"'
				caption="03.06.2020"
				actions={
				<React.Fragment>
					<Button>Адрес на карте</Button>
					<Button>Чат с клиентом</Button>
				</React.Fragment>
				}
				>
				№322356
			</RichCell>
			<RichCell
				disabled
				multiline
				before={<Avatar size={72}  />} // src={getAvatarUrl('user_ti')}
				text='Магазин "Автозапчасти"'
				caption="05.06.2020"
				actions={
				<React.Fragment>
					<Button>Адрес на карте</Button>
					<Button>Чат с клиентом</Button>
				</React.Fragment>
				}
				>
				№789-7890      	
			</RichCell>
		</Group>	
      {/* <Geodata/>  */}
    </Panel>
  );
  
  Сourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};


export default Сourier;
