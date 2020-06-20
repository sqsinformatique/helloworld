import React from 'react';
import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import { FormLayout, FormStatus, Panel, PanelHeader, Input, Button, Group, Cell, List, Header, PanelHeaderButton } from '@vkontakte/vkui';
import { isValidPhone, trim } from '../../modules/utils'

import { getCuriersByBusinessID, postCreateBindingBusinessCourier, postDeleteBindingBusinessCourier } from '../../modules/backRequests'

const osName = platform();

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

    async componentDidMount() {
        const { user } = this.props;
        const response = await getCuriersByBusinessID(user.business_id)
        if (response) {
            this.setState({ couriers: response })
        }
    }

    async createBinding() {
        const { user } = this.props;
        const { phone } = this.state;

        await postCreateBindingBusinessCourier(user.business_id, trim(phone, '+'))

        const response = await getCuriersByBusinessID(user.business_id)
        if (response) {
            this.setState({ couriers: response })
        }
    }

    async unbind(curier_id) {
        const { user } = this.props;

        await postDeleteBindingBusinessCourier(user.business_id, curier_id)

        const response = await getCuriersByBusinessID(user.business_id)
        if (response) {
            this.setState({ couriers: response })
        }
    }

    addCourier = () => {
        this.setState({ validatePhone: isValidPhone(this.state.phone) })
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
                    left={<PanelHeaderButton onClick={props.go} data-to="home">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                >
                    Бизнес: настройки
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
                        type="tel"
                        onChange={this.updatePhoneValue}
                    />
                    <Button size="xl" onClick={this.addCourier}>Добавить</Button>
                </FormLayout>
            </Panel>
        );
    }
}

export default BusinessOptions;