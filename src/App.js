import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28CompassOutline from '@vkontakte/icons/dist/28/compass_outline';
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';
import Icon24Notifications from '@vkontakte/icons/dist/24/notification';

import { postCourierGeodata, getClientBySocialID, getCourierBySocialID, getBusinessBySocialID } from './modules/backRequests'

import { ROUTES } from './Routes';

import '@vkontakte/vkui/dist/vkui.css';

// Главная страница
import Home from './panels/Home';

// Регистрация новых пользователей
import WelcomeScreen from './panels/PopUpWindows/WelcomeScreen';
import SetBusinessGroup from './panels/PopUpWindows/SetBusinessGroup'

// Клиент
import Client from './panels/Client/Client';
import CourierGeodataForClient from './panels/Client/CourierGeodataForClient';

// Курьер
import Сourier from './panels/Courier/Сourier';
import ClientGeodataForCourier from './panels/Courier/ClientGeodataForCourier';

// Бизнес
import Business from './panels/Business/Business';
import BusinessOptions from './panels/Business/BusinessOptions';
import BusinessNewOrder from './panels/Business/BusinessNewOrder';
import CourierGeodataForBusiness from './panels/Business/CourierGeodataForBusiness';
import BusinessAllCourier from './panels/Business/BusinessAllCourier';


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
			user: null,
			courier_geodata: { lat: 55.659200, long: 37.753314 },
		};

		this.onStoryChange = this.onStoryChange.bind(this);

		this.state.geoUpdateInterval = setInterval(() => {
			this.fetchCourierGeo()
		}, 5000);
	}

	async fetchCourierGeo() {
		switch (this.state.activePanel) {
			case 'courier':
			case 'view_where_client':
				// Запрашиваем координаты курьера, если находимся на панелях courier или view_where_client
				// Надо также дополнить всеми остальными панелями курьера, чтобы координаты передавались всё
				// время, пока мы в режиме Курьера
				const geodata = await bridge.send('VKWebAppGetGeodata');
				this.setState({ courier_geodata: geodata });

				if (!this.state.user) {
					return
				}

				await postCourierGeodata(this.state.user.curier_id, { lat: geodata.lat, long: geodata.long })
				break;
			default:
		}
	}

	async componentDidMount() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		this.setState({ fetchedUser: user, popout: null });
	}

	onStoryChange(e) {
		this.setState({ activeStory: e.currentTarget.dataset.story })
	}

	setLocation = (route) => {
		console.log("route", route)
		if (route !== 'home') {
			bridge.send('VKWebAppSetLocation', { location: route });
		} else {
			bridge.send('VKWebAppSetLocation', { location: '' });
		}
	}

	// Проверяем, есть ли такой пользователь у нас на бэке
	async fetchUser(userType) {
		const { fetchedUser } = this.state
		let response
		switch (userType) {
			case 'client':
				response = await getClientBySocialID(fetchedUser.id)
				break;
			case 'courier':
				response = await getCourierBySocialID(fetchedUser.id)
				break;
			case 'business':
				response = await getBusinessBySocialID(fetchedUser.id)
				break;
			default:
				return true;
		}

		if (response) {
			this.setState({ user: response })
			return true;
		}

		this.setState({ popout: <WelcomeScreen userType={userType} fetchedUser={this.state.fetchedUser} closePopout={this.closePopout} /> })
		return false;
	}

	closePopout = (result, userType) => {
		console.log(result)
		if (!result) {
			this.setState({ popout: null, activePanel: 'home' });
		} else {
			if (userType === 'business') {
				this.setState({ popout: <SetBusinessGroup userType={userType} fetchedUser={this.state.fetchedUser} closePopout={this.closePopout} /> })
			} else {
				this.setState({ popout: null });
			}
		}
	}

	go = (e, object) => {
		const route = e.currentTarget.dataset.to;

		// Вывод предупреждения для нового пользователя
		this.fetchUser(route)

		if (route === 'view_where_courier') {
			this.setState({ client_order: object })
			this.fetchCourierGeo()
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

	tabbarByUserType(userType) {
		var tabbarApp = null
		switch (this.state.activePanel) {
			case 'client':
				tabbarApp = <Tabbar>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'client_orders_ondelivery'}
						data-story="client_orders_ondelivery"
						text="Мне везут"
					><Icon28CubeBoxOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'client_add_order'}
						data-story="cient_add_order"
						text="Новый заказ"
					><Icon28MarketAddBadgeOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'client_options'}
						data-story="client_options"
						text="Настройки"
					><Icon28SettingsOutline /></TabbarItem>
				</Tabbar >
				break;
			case 'courier':
				tabbarApp = <Tabbar>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'main'}
						data-story="client_orders_ondelivery"
						text="Я везу"
					><Icon28CubeBoxOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'client_options'}
						data-story="client_options"
						text="Настройки"
					><Icon28SettingsOutline /></TabbarItem>
				</Tabbar >
				break;
			case 'business':
				tabbarApp = <Tabbar>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'main'}
						data-story="main"
						text="Заказы в работе"
					><Icon28ListOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'business_couriers_onmap'}
						data-story="business_couriers_onmap"
						text="Курьеры на карте"
					><Icon28CompassOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'business_add_order'}
						data-story="business_add_order"
						text="Новый заказ"
					><Icon28MarketAddBadgeOutline /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'business_options'}
						data-story="business_options"
						text="Настройки"
					><Icon28SettingsOutline /></TabbarItem>
				</Tabbar>
				break;
			default:
		}

		return tabbarApp
	}

	render() {
		return (
			<Epic activeStory={this.state.activeStory} tabbar={this.tabbarByUserType(this.state.activePanel)}
			>
				<View id='main' activePanel={this.state.activePanel} popout={this.state.popout}>
					<Home id='home' fetchedUser={this.state.fetchedUser} go={this.go} />
					<Client id='client' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
					<Сourier id='courier' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
					<Business id='business' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
					<CourierGeodataForClient id='view_where_courier' order={this.state.client_order} go={this.go} />
					<ClientGeodataForCourier id='view_where_client' order={this.state.courier_order} courier_geodata={this.state.courier_geodata} go={this.go} />
					<CourierGeodataForBusiness id='view_where_courier_for_business' order={this.state.client_order_for_business} go={this.go} />
				</View>
				<View id="business_couriers_onmap" activePanel="business_couriers_onmap">
					<BusinessAllCourier id="business_couriers_onmap" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
				</View>
				<View id="business_add_order" activePanel="business_add_order">
					<BusinessNewOrder id="business_add_order" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
				</View>
				<View id="business_options" activePanel="business_options">
					<BusinessOptions id="business_options" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
				</View>

			</Epic>
		);
	}
}

export default App;

