import React from 'react';
import { Panel, PanelHeader, PanelHeaderButton, Group, Select } from '@vkontakte/vkui';
import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { putUpdateCourierOptions, getCourierOptionsByID } from '../../modules/backRequests'

const osName = platform();

const routing_modes = ["masstransit", "driving"]

class CourierOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: null,
            user: props.user,
            options: { routing_mode: routing_modes[0] },
            routing_mode: 1,
        };

        this.onChange = this.onChange.bind(this);
    }

    async componentDidMount() {
        const {user} = this.state
        const response = await getCourierOptionsByID(user.curier_id)
        if (response) {
            this.setState({ options: { routing_mode: response.routing_mode } })
        }

    }

    async updateCourierOptions() {
        const { options, user } = this.state
        await putUpdateCourierOptions(user.curier_id, options)
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        console.log("name value", name, value, routing_modes[value] )

        this.setState({ options: { routing_mode: routing_modes[value] } , [name]: value});
        console.log("courier options", this.state.options)
        this.updateCourierOptions()
    }

    render() {
        const props = this.props;

        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={props.go} data-to="home">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                >
                    Курьер: настройки
				</PanelHeader>
                <Group>
                    <Select top="Выберите тип транспорта" 
                        name="routing_mode"
                        value={this.state.routing_mode}
                        onChange={this.onChange}
                    >
                        <option value="0">Автомобиль</option>
                        <option value="1">Общественный транспорт</option>
                    </Select>
                </Group>
            </Panel>
        );
    }
}

export default CourierOptions;