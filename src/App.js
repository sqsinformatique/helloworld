import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline'
import Icon28SearchOutline from '@vkontakte/icons/dist/28/search_outline';
import { ROUTES } from './Routes';

import '@vkontakte/vkui/dist/vkui.css';


import Home from './panels/Home';
import Client from './panels/Client';
import Сourier from './panels/Сourier';
import Business from './panels/Business';
import GeodataClient from './panels/Geodata';
import GeodataCourier from './panels/CourierGeodata';
import GeodataBusiness from './panels/BusinessGeodata';

const location = window.location.hash.substr(1);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: ~ROUTES.indexOf(location) ? location : 'home',
			fetchedUser: null,
			popout: <ScreenSpinner size='large' />,
			activeStory: 'main',
			client_order: null,
			courier_order: null,
			client_order_for_business: null,
		};

		this.onStoryChange = this.onStoryChange.bind(this);
	}

	async componentDidMount() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		this.setState({ fetchedUser: user, popout: null });
	}

	onStoryChange(e) {
		this.setState({ activeStory: e.currentTarget.dataset.story })
	}

	setLocation = (route) => {
		if (route !== 'home') {
			bridge.send('VKWebAppSetLocation', { location: route });
		} else {
			bridge.send('VKWebAppSetLocation', { location: '' });
		}
	}

	go = (e, object) => {
		const route = e.currentTarget.dataset.to;
		if (route === 'view_where_courier') {
			this.setState({ client_order: object })
		}
		if (route === 'view_where_client') {
			this.setState({ courier_order: object })
		}
		if (route === 'view_where_courier_for_business') {
			this.setState({ client_order_for_business: object })
		}

		this.setState({ activePanel: route })
		this.setLocation(route)
	};

	render() {
		return (
			<Epic activeStory={this.state.activeStory} tabbar={
				<Tabbar>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'main'}
						data-story="main"
						text="Начало"
					><Icon28NewsfeedOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'discover'}
						data-story="discover"
						text="Поиск"
					><Icon28SearchOutline /></TabbarItem>
				</Tabbar>
			}>
				<View id='main' activePanel={this.state.activePanel} popout={this.state.popout}>
					<Home id='home' fetchedUser={this.state.fetchedUser} go={this.go} />
					<Client id='client' data={this.state.data} go={this.go} />
					<Сourier id='courier' go={this.go} />
					<Business id='business' go={this.go} />
					<GeodataClient id='view_where_courier' order={this.state.client_order} go={this.go} />
					<GeodataCourier id='view_where_client' order={this.state.courier_order} go={this.go} />
					<GeodataBusiness id='view_where_courier_for_business' order={this.state.client_order_for_business} go={this.go} />
				</View>
			</Epic>
		);
	}
}

export default App;

