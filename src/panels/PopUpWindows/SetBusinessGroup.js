import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Alert, Select } from '@vkontakte/vkui';

class SetBusinessGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: props.fetchedUser,
            groups: null,
            group_id: 0,
        };
    }

    async loadGroups() {
        const props = this.props
        const token = await bridge.send("VKWebAppGetAuthToken", { "app_id": 7516660, "scope": "groups" });
        console.log(token)
        const groupsData = await bridge.send("VKWebAppCallAPIMethod", {
            "method": "groups.get",
            "request_id": "sqsrequest",
            "params": {
                "user_id": props.fetchedUser.id,
                "v": "5.110",
                "access_token": token.access_token,
                "extended": true,
                "fields": "contacts",
            }
        });
        console.log(groupsData.response)
        this.setState({ groups: groupsData.response.items, group_id: groupsData.response.items[0].id })
        console.log(this.state.groups)
    }

    async componentDidMount() {
        await this.loadGroups()
    }

    async createUser() {
        const props = this.props;
        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/'

        switch (props.userType) {
            case 'client':
                url = url + 'clients'
                break;
            case 'courier':
                url = url + 'curiers'
                break;
            case 'business':
                url = url + 'business'
                break;
            default:
                return true;
        }

        const userPhone = await bridge.send("VKWebAppGetPhoneNumber", {});
        console.log(userPhone)

        const userEmail = await bridge.send("VKWebAppGetEmail", {});
        console.log(userEmail)
        console.log("this.state.group_id", this.state.group_id)
        let user = {
            social_id: this.state.fetchedUser.id.toString(),
            email: userEmail.email,
            group_id: this.state.group_id.toString(),
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

        props.closePopout(true)
    }

    closePopout = () => {
        const props = this.props;
        props.closePopout(false)
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
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
            default:
        }

        const { group_id } = this.state;

        return (
            <Alert
                actions={[{
                    title: 'Сохранить',
                    autoclose: false,
                    action: () => this.createUser(),
                }, {
                    title: 'Отмена',
                    autoclose: false,
                    mode: 'cancel',
                    action: () => this.closePopout(),
                }]}
            >
                <h1>Выбор сообщества!</h1>
                <div><br />
                Пожалуйста, выберить сообщество связанное с учётной записью, которое представляет Ваш бизнес.
                <br />
                &nbsp;
                </div>
                <Select
                    name="group_id"
                    value={group_id}
                    onChange={this.onChange}
                >
                    {this.state.groups && this.state.groups.map((group, index) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </Select>
            </Alert>
        )
    }
}

export default SetBusinessGroup;
