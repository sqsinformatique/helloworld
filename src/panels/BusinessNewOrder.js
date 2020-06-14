import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { RichCell, Button, Avatar, FormLayout, Input, Textarea, Select } from '@vkontakte/vkui';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Group from '@vkontakte/vkui/dist/components/Group/Group';

import './Business.css';

const osName = platform();

class BusinessNewOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: null,
            email: '',
            purpose: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        this.setState({ [name]: value });
    }

    buttonHandler() {
        alert("test!")
    }

    render() {
        const props = this.props;
        const { email, purpose } = this.state;
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
                        type="email"
                        top="E-mail"
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        status={email ? 'valid' : 'error'}
                        bottom={email ? 'Электронная почта введена верно!' : 'Пожалуйста, введите электронную почту'}
                    />

                    <Input top="Мобильный телефон" keyboardType={'phone-pad'} defaultValue="+7 12 344 15 48" />
                    <Input top="Адрес доставки" />

                    <Textarea top="Описание заказа" />
                    <Select top="Выбрать курьера">
                        <option value="m">Иван</option>
                        <option value="f">Василий</option>
                    </Select>
                    <Button size="xl" onClick={this.buttonHandler}>Создать заказ</Button>
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
