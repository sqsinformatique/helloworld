import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { Button, FormLayout, Input, Textarea, Select, FormLayoutGroup } from '@vkontakte/vkui';
import { isValidPhone } from '../../modules/utils'

import { postCreateOrder, getCuriersByBusinessID } from '../../modules/backRequests'

import './Business.css';

const osName = platform();

class BusinessNewOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: null,
            order: {
                description: '',
                email: '',
                phone: '',
                order_number: '',
                address: '',
                order_date: '',
                order_time_begin: '',
                order_time_end: '',
                curier_id: 0,
            },
            user: props.user,
            couriers: null,
        };

        this.onChange = this.onChange.bind(this);
    }

    async componentDidMount() {
        const { user } = this.props;
        const response = await getCuriersByBusinessID(user.business_id)
        if (response) {
            this.setState({ couriers: response })
            if (response.length > 0) {
                this.setState({ curier_id: response[0].curier_id })
            }
        }
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        const order = { ...this.state.order, ...{ [name]: value } }
        this.setState({ order: order });
        console.log(this.state.order)
    }

    createOrderHandler = () => {
        const { user } = this.props
        const { order } = this.state
        postCreateOrder(user.business_id, order)
    }

    render() {
        const props = this.props;
        const { email, phone, address, order_number, description, curier_id, order_date, order_time_begin, order_time_end } = this.state.order;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={props.go} data-to="business">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                >
                    {[props.business_name]}
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
                        value={curier_id}
                        onChange={this.onChange}
                    >
                        {this.state.couriers && this.state.couriers.map((courier, index) => (
                            <option key={courier.curier_id} value={courier.curier_id}>{courier.first_name} {courier.last_name}</option>
                        ))}
                    </Select>
                    <Button size="xl" onClick={this.createOrderHandler}>Создать заказ</Button>
                </FormLayout>
            </Panel>
        );
    }
}

BusinessNewOrder.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default BusinessNewOrder;
