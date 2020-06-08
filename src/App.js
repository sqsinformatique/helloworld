import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View } from '@vkontakte/vkui';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';


import Home from './panels/Home';
import Client from './panels/Client';
import Сourier from './panels/Сourier';
import Business from './panels/Business';
import Geodata from './panels/Geodata';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
			<View id='main' activePanel={activePanel} popout={popout}>
				<Home id='home' fetchedUser={fetchedUser} go={go} />
				<Client id='client' go={go} />
				<Сourier id='courier' go={go} />
				<Business id='business' go={go} />
				<Geodata id='view_where_courier' go={go} title='Магазин "Развивающие игрушки"' delivery_date="03.06.2020" delivery_state="Везут"/>
			</View>
	);
}

export default App;
