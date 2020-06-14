import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import { PopoutWrapper, Button, Alert } from '@vkontakte/vkui';

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: props.fetchedUser,

        };
    }

    async createUser() {
        const props = this.props;
        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/'

        switch (props.userType) {
			case 'client':
				url = url+'clients'
				break;
			case 'courier':
				url = url+'curiers'
				break;
			case 'business':
				url = url+'business'
				break;
			default:
				return true;
		}

        const userPhone = await bridge.send("VKWebAppGetPhoneNumber", {});
        console.log(userPhone)

        const userEmail = await bridge.send("VKWebAppGetEmail", {});
        console.log(userEmail)

        let user = {
            social_id: this.state.fetchedUser.id.toString(),
            email: userEmail.email,
            telephone: userPhone.phone_number
        };

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            // получаем тело ответа
            let json = response.json();
            console.log(json)
        }

        props.closePopout();
    }

    render() {
        const props = this.props;

        var userType
        switch (props.userType) {
            case 'client':
                userType = 'клиент'
                break;
            case 'courier':
                userType = 'курьер'
                break;
            case 'business':
                userType = 'бизнес-партнёр'
                break;
        }

        return (
            <Alert
                actions={[{
                    title: 'Я согласен',
                    autoclose: true,
                    action: () => this.createUser(),
                }, {
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                onClose={props.closePopout}
            >
                <h1>Здравствуйте!</h1>
                Вы новый <b>{userType}</b> нашего приложения!
                <div><br />
                Подтвердите, что даёте согласие, на доступ приложения к информации о вашей учётной записи в социальной сети ВК. <br />Данная информация не будет передаваться третьим лицам.
Мы храним только ID в социальной сети и мы не храним Ваш email и мобильный номер.
                </div>
            </Alert>
        )
    }
}

export default WelcomeScreen;
