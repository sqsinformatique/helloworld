import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, Epic, Tabbar, TabbarItem, Panel, PanelHeader } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline'
import Icon28SearchOutline from '@vkontakte/icons/dist/28/search_outline';
import Icon28CompassOutline from '@vkontakte/icons/dist/28/compass_outline';
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import { ROUTES } from './Routes';

import '@vkontakte/vkui/dist/vkui.css';


import Home from './panels/Home';
import Client from './panels/Client/Client';
import Сourier from './panels/Сourier';
import Business from './panels/Business';
import GeodataClient from './panels/Geodata';
import GeodataCourier from './panels/CourierGeodata';
import GeodataBusiness from './panels/BusinessGeodata';
import BusinessAllCourier from './panels/BusinessAllCourier';
import BusinessNewOrder from './panels/BusinessNewOrder';

import WelcomeScreen from './panels/PopUpWindows/WelcomeScreen';

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

	// Проверяем, есть ли такой пользователь у нас на бэке
	async fetchUser(userType) {
		let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/'
		switch (userType) {
			case 'client':
				url = url+'clients/'
				break;
			case 'courier':
				url = url+'curiers/'
				break;
			case 'business':
				url = url+'business/'
				break;
			default:
				return true;
		}

		let response = await fetch(url + this.state.fetchedUser.id);
		if (response.ok) { // если HTTP-статус в диапазоне 200-299
			return true;
		}
		this.setState({ popout: <WelcomeScreen userType={userType} fetchedUser={this.state.fetchedUser} closePopout={this.closePopout} /> })
		return false;
	}

	closePopout = () => {
		this.setState({ popout: null, activePanel: 'home' });
	}

	go = (e, object) => {
		const route = e.currentTarget.dataset.to;

		// Вывод предупреждения для нового пользователя
		this.fetchUser(route)

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
		var tabbarApp
		if (this.state.activePanel === 'business') {
			tabbarApp = <Tabbar>
				<TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'main'}
					data-story="main"
					text="Начало"
				><Icon28NewsfeedOutline /></TabbarItem>
				<TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'business_view'}
					data-story="business_view"
					text="Курьеры на карте"
				><Icon28CompassOutline /></TabbarItem>
				<TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'business_view_add_order'}
					data-story="business_view_add_order"
					text="Новый заказ"
				><Icon28MarketAddBadgeOutline /></TabbarItem>
				<TabbarItem
					onClick={this.onStoryChange}
					selected={this.state.activeStory === 'discover'}
					data-story="discover"
					text="Поиск заказа"
				><Icon28SearchOutline /></TabbarItem>
			</Tabbar>
		} else {
			tabbarApp = null
		}
		return (
			<Epic activeStory={this.state.activeStory} tabbar={tabbarApp}
			>
				<View id='main' activePanel={this.state.activePanel} popout={this.state.popout}>
					<Home id='home' fetchedUser={this.state.fetchedUser} go={this.go} />
					<Client id='client' data={this.state.data} go={this.go} />
					<Сourier id='courier' go={this.go} />
					<Business id='business' go={this.go} />
					<GeodataClient id='view_where_courier' order={this.state.client_order} go={this.go} />
					<GeodataCourier id='view_where_client' order={this.state.courier_order} go={this.go} />
					<GeodataBusiness id='view_where_courier_for_business' order={this.state.client_order_for_business} go={this.go} />
				</View>
				<View id="business_view" activePanel="business_view">
					<BusinessAllCourier id="business_view" business_id='123' business_name='Магазин Автозапчастей' go={this.go} />
				</View>
				<View id="business_view_add_order" activePanel="business_view_add_order">
					<BusinessNewOrder id="business_view_add_order" business_id='123' business_name='Магазин Автозапчастей' go={this.go} />
				</View>
			</Epic>
		);
	}
}

export default App;

