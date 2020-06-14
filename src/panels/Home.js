import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline'
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline'

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

		<Group title="Navigation Example">
			<Div>
				<Cell expandable before={<Icon28UserOutline/>} onClick={go} data-to="client">
					Я клиент
				</Cell>
				<Cell expandable before={<Icon28MarketOutline/>} onClick={go} data-to="courier">
					Я курьер
				</Cell>
				<Cell expandable before={<Icon28CubeBoxOutline/>} onClick={go} data-to="business">
					Я бизнес
				</Cell>
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
