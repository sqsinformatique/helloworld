import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, Epic, Tabbar, TabbarItem, Panel, Div, Button, Group, PanelHeader } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28CompassOutline from '@vkontakte/icons/dist/28/compass_outline';
import Icon28MarketAddBadgeOutline from '@vkontakte/icons/dist/28/market_add_badge_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';
import Icon24Notifications from '@vkontakte/icons/dist/24/notification';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline'
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';

import { IconLogo } from './logo/IconLogo';
import './App.css';

import { postCourierGeodata, getClientBySocialID, getCourierBySocialID, getBusinessBySocialID } from './modules/backRequests'

import { ROUTES } from './Routes';

import '@vkontakte/vkui/dist/vkui.css';

// Главная страница
import Home from './panels/Home';

// Регистрация новых пользователей
import WelcomeScreen from './panels/PopUpWindows/WelcomeScreen';
import SetBusinessGroup from './panels/PopUpWindows/SetBusinessGroup'

// Смена состояния заказа
import SetOrderState from './panels/PopUpWindows/SetOrderState'

// Клиент
import Client from './panels/Client/Client';
import ClientOptions from './panels/Client/ClientOptions';
import CourierGeodataForClient from './panels/Client/CourierGeodataForClient';
import ChatWithCourier from './panels/Client/ChatWithCourier'

// Курьер
import Сourier from './panels/Courier/Сourier';
import CourierOptions from './panels/Courier/CourierOptions';
import ClientGeodataForCourier from './panels/Courier/ClientGeodataForCourier';
import ChatWithClient from './panels/Courier/ChatWithClient'

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
			activePanel: 'home',
			fetchedUser: null,
			popout: <ScreenSpinner size='large' />,
			activeStory: 'more',
			client_order: null,
			courier_order: null,
			client_order_for_business: null,
			user: null,
			courier_geodata: { lat: 55.659200, long: 37.753314 },
			show_user_menu: 'none',
			invertor: false,
		};

		this.onStoryChange = this.onStoryChange.bind(this);

		this.state.geoUpdateInterval = setInterval(() => {
			this.fetchCourierGeo()
		}, 5000);
	}

	async fetchCourierGeo() {
		switch (this.state.activePanel) {
			case 'client_orders_ondelivery':
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
		console.log("e.currentTarget.dataset.story", e.currentTarget.dataset.story)
		this.setState({ activeStory: e.currentTarget.dataset.story, activePanel: e.currentTarget.dataset.story })
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
		console.log("userType", userType)
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
			this.setState({ popout: null, show_user_menu: 'none', activePanel: 'home' });
		} else {
			if (userType === 'business') {
				this.setState({ popout: <SetBusinessGroup userType={userType} fetchedUser={this.state.fetchedUser} closePopout={this.closePopout} /> })
			} else {
				this.setState({ popout: null });
			}
		}

		this.setState({ user: this.state.user })
	}


	go = (e, object, update) => {
		const route = e.currentTarget.dataset.to;

		if (route === 'set_order_state') {
			this.setState({ popout: <SetOrderState order={object} fetchedUser={this.state.fetchedUser} closePopout={this.closePopout} update={update} /> })
			return
		}

		// Вывод предупреждения для нового пользователя
		this.fetchUser(route)

		if (route === 'view_where_courier') {
			this.setState({ client_order: object })
			this.fetchCourierGeo()
		}
		if (route === 'view_where_client') {
			this.setState({ courier_order: object })
		}
		if (route === 'chat_with_client') {
			this.setState({ courier_order: object })
		}
		if (route === 'chat_with_courier') {
			this.setState({ client_order: object })
		}
		if (route === 'view_where_courier_for_business') {
			this.setState({ client_order_for_business: object })
		}

		if (route === 'home') {
			this.setState({ show_user_menu: 'none' })
		}

		this.setState({ activePanel: route })
		this.setLocation(route)
	};

	onClick = (e, user_menu, user_story) => {
		// Вывод предупреждения для нового пользователя
		this.fetchUser(user_menu)

		this.setState({ activeStory: user_story, activePanel: 'client_orders_ondelivery', show_user_menu: user_menu })
		console.log(this.state)
	}

	buildDisplay(user_menu, user) {
		let display = null
		switch (user_menu) {
			case 'client':
				display = <Epic activeStory={this.state.activeStory} tabbar={
					<Tabbar>
						<TabbarItem
							onClick={this.onStoryChange}
							selected={this.state.activeStory === 'client_orders_ondelivery' || this.state.activeStory === 'client'}
							data-story="client_orders_ondelivery"
							text="Мне везут"
						><Icon28CubeBoxOutline /></TabbarItem>
						<TabbarItem
							onClick={this.onStoryChange}
							selected={this.state.activeStory === 'client_options'}
							data-story="client_options"
							text="Настройки"
						><Icon28SettingsOutline /></TabbarItem>
					</Tabbar >}>
					< View id='client_orders_ondelivery' activePanel={this.state.activePanel} popout={this.state.popout}>
						<Client id='client_orders_ondelivery' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
						<CourierGeodataForClient id='view_where_courier' order={this.state.client_order} go={this.go} />
						<ChatWithCourier id='chat_with_courier' order={this.state.client_order} go={this.go} />
					</View >
					< View id='client_options' activePanel='client_options' >
						<ClientOptions id='client_options' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
					</View >
				</Epic>
				break;
			case 'courier':
				display = <Epic activeStory={this.state.activeStory} tabbar={
					<Tabbar>
						<TabbarItem
							onClick={this.onStoryChange}
							selected={this.state.activeStory === 'client_orders_ondelivery'}
							data-story="client_orders_ondelivery"
							text="Я везу"
						><Icon28CubeBoxOutline /></TabbarItem>
						<TabbarItem
							onClick={this.onStoryChange}
							selected={this.state.activeStory === 'courier_options'}
							data-story="courier_options"
							text="Настройки"
						><Icon28SettingsOutline /></TabbarItem>
					</Tabbar >}>
					<View id='client_orders_ondelivery' activePanel={this.state.activePanel} popout={this.state.popout}>
						<Сourier id='client_orders_ondelivery' invertor={this.state.invertor} user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
						<ClientGeodataForCourier id='view_where_client' order={this.state.courier_order} courier_geodata={this.state.courier_geodata} go={this.go} />
						<ChatWithClient id='chat_with_client' order={this.state.courier_order} courier_geodata={this.state.courier_geodata} go={this.go}></ChatWithClient>
					</View>
					< View id='courier_options' activePanel='courier_options' >
						<CourierOptions id='courier_options' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
					</View >
				</Epic >
				break;
			case 'business':
				display = <Epic activeStory={this.state.activeStory} tabbar={
					<Tabbar>
						<TabbarItem
							onClick={this.onStoryChange}
							selected={this.state.activeStory === 'client_orders_ondelivery'}
							data-story="client_orders_ondelivery"
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
					</Tabbar>}>
					< View id='client_orders_ondelivery' activePanel={this.state.activePanel} popout={this.state.popout}>
						<Business id='client_orders_ondelivery' user={user} fetchedUser={this.state.fetchedUser} go={this.go} />
						<CourierGeodataForBusiness id='view_where_courier_for_business' order={this.state.client_order_for_business} go={this.go} />
					</View >
					<View id="business_couriers_onmap" activePanel="business_couriers_onmap">
						<BusinessAllCourier id="business_couriers_onmap" user={user} fetchedUser={this.state.fetchedUser} go={this.go} />
					</View>
					<View id="business_add_order" activePanel="business_add_order">
						<BusinessNewOrder id="business_add_order" user={user} fetchedUser={this.state.fetchedUser} go={this.go} />
					</View>
					<View id="business_options" activePanel="business_options">
						<BusinessOptions id="business_options" user={user} fetchedUser={this.state.fetchedUser} go={this.go} />
					</View>
				</Epic >
				break;
			default:
				display = <View id='main' activePanel={this.state.activePanel}>
					<Panel id='home'>
						<PanelHeader>
							Где курьер?
						</PanelHeader>
						<Group>
							<Div className="header">
								<IconLogo height={150} className="header__logo" />
							</Div>
						</Group>
						<Group title="Выбор кабинета пользователя">
							<Div>
								<Button before={<Icon28UserOutline />} size="xl" onClick={(e) => this.onClick(e, 'client', 'client_orders_ondelivery')}>Я клиент</Button>
							</Div>
							<Div>
								<Button before={<Icon28MarketOutline />} size="xl" onClick={(e) => this.onClick(e, 'courier', 'client_orders_ondelivery')} >Я курьер</Button>
							</Div>
							<Div>
								<Button before={<Icon28CubeBoxOutline />} size="xl" onClick={(e) => this.onClick(e, 'business', 'client_orders_ondelivery')} >Я бизнес</Button>
							</Div>
						</Group>
					</Panel>
				</View>
		}

		return display
	}

	render() {
		return (
			<Div>
				{this.buildDisplay(this.state.show_user_menu, this.state.user)}
			</Div>
			// <Epic activeStory={this.state.activeStory} tabbar={this.tabbarByUserType(this.state.activePanel)}
			// >
			// 	<View id='main' activePanel={this.state.activePanel} popout={this.state.popout}>
			// 		<Home id='home' fetchedUser={this.state.fetchedUser} go={this.go} />
			// 		<Client id='client' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 		<Сourier id='courier' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 		<Business id='business' user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 		<CourierGeodataForClient id='view_where_courier' order={this.state.client_order} go={this.go} />
			// 		<ClientGeodataForCourier id='view_where_client' order={this.state.courier_order} courier_geodata={this.state.courier_geodata} go={this.go} />
			// 		<CourierGeodataForBusiness id='view_where_courier_for_business' order={this.state.client_order_for_business} go={this.go} />
			// 	</View>
			// 	<View id="business_couriers_onmap" activePanel="business_couriers_onmap">
			// 		<BusinessAllCourier id="business_couriers_onmap" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 	</View>
			// 	<View id="business_add_order" activePanel="business_add_order">
			// 		<BusinessNewOrder id="business_add_order" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 	</View>
			// 	<View id="business_options" activePanel="business_options">
			// 		<BusinessOptions id="business_options" user={this.state.user} fetchedUser={this.state.fetchedUser} go={this.go} />
			// 	</View>

			// </Epic>
		);
	}
}

export default App;

