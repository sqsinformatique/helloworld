import React from 'react';
import { Panel } from '@vkontakte/vkui';
import { PanelHeader, RichCell, Button, Avatar, FormLayout, Textarea, Div, CardGrid, Card } from '@vkontakte/vkui';
import { platform, IOS, ANDROID } from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import { orderStateToString, fullOrderDate } from '../../modules/parseTypes'
import { getClientByOrderID, postMessages, getMessages } from '../../modules/backRequests'

const osName = platform();

class ChatWithCourier extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courier_id: this.props.order.curier_id,
            messages: null,
            client: null,
            msg: '',
        };

        this.onChange = this.onChange.bind(this);

        this.state.chatUpdateInterval = setInterval(() => {
            this.fetchChat()
        }, 3000);
    }

    async componentDidMount() {
        const props = this.props;
        console.log("order", props.order)
        this.setState({ courier_id: props.order.courier_id })
        const response = await getClientByOrderID(props.order.order_id)
        if (response) {
            this.setState({ client: response })

            const messages = await getMessages("chat_" + props.order.order_id.toString() + props.order.curier_id.toString() + response.client_id.toString())
            if (messages) {
                this.setState({ messages: messages })
            }
        }

    }

    async fetchChat() {
        const props = this.props;
        const chat_id = "chat_" + props.order.order_id.toString() + props.order.curier_id.toString() + this.state.client.client_id.toString()
        console.log("chat_id", chat_id)
        const messages = await getMessages(chat_id)
        if (messages) {
            this.setState({ messages: messages })
        }
    }

    async postAndUpdate() {
        const props = this.props;
        const chat_id = "chat_" + props.order.order_id.toString() + props.order.curier_id.toString() + this.state.client.client_id.toString()
        const response = await postMessages(chat_id, 'клиент', this.state.msg)
        if (response) {
            this.setState({ msg: '' })
            const messages = await getMessages(chat_id)
            if (messages) {
                this.setState({ messages: messages })
            }
        }
    }

    onClick = (e) => {
        this.postAndUpdate()
    }

    onChange(e) {
        const { name, value } = e.currentTarget;
        this.setState({ msg: value });
        console.log(this.state.msg)

    }

    render() {
        const { id, order } = this.props;
        const { msg } = this.state
        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderButton onClick={this.props.go} data-to="client_orders_ondelivery">
                        {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                    </PanelHeaderButton>}
                // right={miniPanel}
                >
                     Чат с курьером
                </PanelHeader>
                <RichCell
                    key={order.order_number}
                    disabled
                    multiline
                    before={<Avatar size={72} src={order.curier_photo_100} />} // src={getAvatarUrl('user_ti')}
                    text={'Заказ: ' + order.order_number}
                    caption={fullOrderDate(order)}
                    after={orderStateToString(order.order_state)}
                >
                </RichCell>
                <FormLayout>
                    <Textarea value={msg}
                        onChange={this.onChange}
                        top="Введите сообщение" placeholder="текст сообщения" />
                </FormLayout>
                <Div>
                    <Button size="xl" onClick={(e) => this.onClick(e)}>Отправить сообщение</Button>
                </Div>

                {this.state.messages && this.state.messages.map((message) =>
                    <CardGrid>
                        <Card size="l">
                            <Div >{message.sender}: {message.message}</Div>
                        </Card>
                    </CardGrid>
                )
                }
            </Panel>
        )
    }
}

ChatWithCourier.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};


export default ChatWithCourier;