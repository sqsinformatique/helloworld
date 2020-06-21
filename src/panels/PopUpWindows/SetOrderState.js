import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Alert, Div, Button, Group } from '@vkontakte/vkui';
import Icon36Done from '@vkontakte/icons/dist/36/done';
import Icon36Cancel from '@vkontakte/icons/dist/36/cancel';

import { putUpdateOrderState } from '../../modules/backRequests'

class SetOrderState extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: props.fetchedUser,
            order: props.order,
            groups: null,
            group_id: 0,
        };
    }

    closePopout = () => {
        const props = this.props;
        props.closePopout(true)
    }

    async update(newState) {
        const props = this.props;
        await putUpdateOrderState(props.order.order_id, newState)
        await props.update()
        props.closePopout(true)  
    }

    onClick = (e, newState) => {
        const props = this.props;

        console.log("object", props.order)

        this.update(newState)
    }

    render() {

        return (
            <Alert
                actions={[{
                    title: 'Отмена',
                    autoclose: false,
                    mode: 'cancel',
                    action: () => this.closePopout(),
                }]}
            >
                <h1>Смена состояния заказа</h1>

                <Group >
                    <Div><Button before={<Icon36Done />} size="xl" onClick={(e) => this.onClick(e, 'accepted')} size="xl">Получен</Button></Div>
                    <Div><Button before={<Icon36Cancel />} size="xl" onClick={(e) => this.onClick(e, 'canceled')} size="xl" >Отказ  </Button></Div>
                </Group>
            </Alert>
        )
    }
}

export default SetOrderState;
