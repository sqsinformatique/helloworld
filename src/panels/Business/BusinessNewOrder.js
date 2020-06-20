import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Button, FormLayout, Input, Textarea, Select, FormLayoutGroup, Avatar, Snackbar } from '@vkontakte/vkui';
import { isValidPhone, trim, randomInteger } from '../../modules/utils'

import { postCreateOrder, getCuriersByBusinessID } from '../../modules/backRequests'

import './Business.css';

const blueBackground = {
    backgroundColor: 'var(--accent)'
};

const osName = platform();

class BusinessNewOrder extends React.Component {
    constructor(props) {
        super(props);

        var now = new Date();
        var mm = now.getMonth() + 1; // getMonth() is zero-based
        var dd = now.getDate();
        var hh = now.getHours()
        const nowString = now.getFullYear() + "-" + (mm > 9 ? '' : '0') + mm + "-" + (dd > 9 ? '' : '0') + dd

        this.state = {
            snackbar: null,
            fetchedUser: null,
            order: {
                description: '',
                email: '',
                phone: '',
                order_number: '',
                address: '',
                order_date: nowString,
                order_time_begin: (hh > 9 ? '' : '0') + hh + ":00",
                order_time_end: (hh + 1 > 9 ? '' : '0') + (hh + 1) + ":00",
                curier_id: 0,
            },
            selected_curier: 0,
            user: props.user,
            couriers: null,
        };

        this.onChange = this.onChange.bind(this);
        this.openSaveOk = this.openSaveOk.bind(this);
        this.openSaveFail = this.openSaveFail.bind(this);
    }

    async componentDidMount() {
        const { user } = this.props;
        const response = await getCuriersByBusinessID(user.business_id)
        if (response) {
            this.setState({ couriers: response })
            if (response.length > 0) {
                var now = new Date();
                var mm = now.getMonth() + 1; // getMonth() is zero-based
                var dd = now.getDate();
                var hh = now.getHours()
                const nowString = now.getFullYear() + "-" + (mm > 9 ? '' : '0') + mm + "-" + (dd > 9 ? '' : '0') + dd

                const order = {
                    curier_id: response[0].curier_id,
                    order_date: nowString,
                    order_time_begin: (hh > 9 ? '' : '0') + hh + ":00",
                    order_time_end: (hh + 1 > 9 ? '' : '0') + (hh + 1) + ":00",
                }


                this.setState({ order: order })
            }
        }
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        let order
        if (name === 'curier_id') {
            const courier = this.state.couriers[value]
            this.state.order.curier_id = courier.curier_id
            this.setState({ selected_curier: value })
        } else {
            order = { ...this.state.order, ...{ [name]: value } }
            this.setState({ order: order });
        }
        console.log(this.state.order)
    }

    openSaveOk() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Заказ сохранён
          </Snackbar>
        });
    }

    openSaveFail() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16Clear fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Ошибка сохранения!
          </Snackbar>
        });
    }


    // Тест!
    async sendMessagetoClient() {
        const rndID = randomInteger(1, 1000000000)
        const result = await bridge.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "request_id": "12335",
            "params": {
                "user_id": "600629237",
                "v": "5.110",
                "random_id": rndID,
                "peer_id": "600629237",
                "message": "создан заказ",
                "access_token": "419610b0bee9752de2b6f00bd58226703377b2e0b894809bb2b7b5f141c6a412711ac531d10edb4fd8e23"
            }
        });

        console.log("sendMessagetoClient", result)

    }

    createOrderHandler = () => {
        const { user } = this.props
        const { order } = this.state
        const response = postCreateOrder(user.business_id, order)
        if (response) {
            this.sendMessagetoClient()
            this.openSaveOk()
        } else {
            this.openSaveFail()
        }
    }

    render() {
        const props = this.props;
        const { email, phone, address, order_number, description, curier_id, order_date, order_time_begin, order_time_end } = this.state.order;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={props.go} data-to="home">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                >
                    Бизнес: новый заказ
                </PanelHeader>
                <FormLayout>
                    <Input
                        top="Номер заказа"
                        name="order_number"
                        value={order_number}
                        onChange={this.onChange}
                    />
                    <Input
                        top="Мобильный телефон"
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={this.onChange}
                    // keyboardType={'phone-pad'}
                    />
                    <Input
                        type="email"
                        top="E-mail"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                    />
                    <Input
                        top="Адрес доставки"
                        name="address"
                        value={address}
                        onChange={this.onChange}
                    />
                    <Textarea
                        top="Описание заказа"
                        name="description"
                        value={description}
                        onChange={this.onChange}
                    />
                    <Input
                        type="date"
                        top="Дата доставки"
                        name="order_date"
                        value={order_date}
                        onChange={this.onChange}
                    />
                    <FormLayoutGroup top="Время доставки">
                        <Input
                            type="time" step="3600000"
                            top="Время от"
                            name="order_time_begin"
                            value={order_time_begin}
                            onChange={this.onChange}
                        />
                        <Input
                            type="time" step="3600000"
                            top="до"
                            name="order_time_end"
                            value={order_time_end}
                            onChange={this.onChange}
                        />
                    </FormLayoutGroup>
                    <Select
                        top="Выбрать курьера"
                        name="curier_id"
                        value={this.state.selected_curier}
                        onChange={this.onChange}
                    >
                        {this.state.couriers && this.state.couriers.map((courier, index) => (
                            <option key={index} value={index}>{courier.first_name} {courier.last_name}</option>
                        ))}
                    </Select>
                    <Button size="xl" onClick={this.createOrderHandler}>Создать заказ</Button>
                </FormLayout>
                {this.state.snackbar}
            </Panel>
        );
    }
}

BusinessNewOrder.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default BusinessNewOrder;
