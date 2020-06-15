import React from 'react';
import { FormLayout, FormStatus, Panel, PanelHeader, Input, Button, Group, Cell, List, Header } from '@vkontakte/vkui';

class BusinessOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: null,
            validatePhone: true,
            user: props.user,
            phone: '',
            couriers: null,
        };
    }

    async getMyCuriers() {
        const props = this.props;
        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/business/curiers/'
        let response = await fetch(url + props.user.business_id);
        let json = await response.json();
        this.setState({ couriers: json.result })
    }

    async componentDidMount() {
        this.getMyCuriers()
    }

    isValidPhone(p) {
        var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        var digits = p.replace(/\D/g, "");
        return phoneRe.test(digits);
    }

    async createBinding() {
        const props = this.props;

        let bindCurier = {
            business_id: props.user.business_id,
            phone: this.state.phone
        };

        console.log(bindCurier)

        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/business/bind_curier'
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(bindCurier)
        });
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            // получаем тело ответа
            let json = response.json();
            console.log(json)
        }

        await this.getMyCuriers()
    }

    async unbind(curier_id) {
        const props = this.props;

        let unbindCurier = {
            business_id: props.user.business_id,
            curier_id: curier_id
        };

        console.log(unbindCurier)
        let url = 'https://sqsinformatique-vk-back.ngrok.io/api/v1/business/unbind_curier'
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(unbindCurier)
        });
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            // получаем тело ответа
            let json = response.json();
            console.log(json)
        }
    }

    addCourier = () => {
        this.setState({ validatePhone: this.isValidPhone(this.state.phone) })
        if (this.state.validatePhone) {
            this.createBinding()
        }
    }

    updatePhoneValue = (e) => {
        this.setState({
            phone: e.target.value,
        });

        console.log(this.state.phone)
    }

    resetPhoneValue = (e) => {
        e.target.value = ''
    }

    render() {
        const props = this.props;

        let errPhone
        if (!this.state.validatePhone) {
            errPhone = <FormStatus header="Некорректный мобильный номер" mode="error">
                Необходимо корректно ввести номер в международном формате
                    </FormStatus>
        }
        return (
            <Panel id={props.id}>
                <PanelHeader
                // left={<PanelHeaderButton onClick={props.go} data-to="home">
                //     {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                // </PanelHeaderButton>}
                >
                    Настройки
				</PanelHeader>
                {this.state.couriers &&
                    <Group header={<Header mode="secondary">Мои курьеры</Header>}>
                        <List>
                            {this.state.couriers.map((courier, index) => (
                                <Cell key={courier.curier_id} removable onRemove={() => {
                                    this.setState({
                                        couriers: [...this.state.couriers.slice(0, index), ...this.state.couriers.slice(index + 1)]
                                    })
                                    this.unbind(courier.curier_id)
                                }}>{courier.first_name} {courier.last_name}</Cell>
                            ))}
                        </List>
                    </Group>
                }
                <FormLayout>
                    {errPhone}
                    <Input id='telephone' top="Добавить курьера по номеру телефона" 
                    // onFocus={this.resetPhoneValue} value="+7123456789"
                    value={this.state.phone}
                    keyboardtype={'phone-pad'}
                     onChange={this.updatePhoneValue} 
                    />
                    <Button size="xl" onClick={this.addCourier}>Добавить</Button>
                </FormLayout>
            </Panel>
        );
    }
}

export default BusinessOptions;