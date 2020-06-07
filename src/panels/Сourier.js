import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, PanelHeaderButton, platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Geodata from './Geodata'

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
        Карта
      </PanelHeader>	
      <Geodata/> 
    </Panel>
  );
  
  Сourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};


export default Сourier;
