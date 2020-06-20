import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Button from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline'
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline'

import './Home.css';

const Home = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>Где курьер?</PanelHeader>
		{/* {fetchedUser &&
		<Group title="User Data Fetched with VK Bridge">
			<Cell
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</Cell>
		</Group>} */}

		<Group title="Стартовый экран">
				<Div>
					<Button className="header__shuffle" level="1" size="xl" onClick={go} data-to="client">Я клиент</Button>
				</Div>
				<Div>
					<Button size="xl" onClick={go} data-to="courier">Я курьер</Button>
				</Div>
				<Div>
					<Button size="xl" onClick={go} data-to="business">Я бизнес</Button>
				</Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
