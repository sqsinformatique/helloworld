import React from 'react';
import { Panel, PanelHeader} from '@vkontakte/vkui';

class ClientOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchedUser: null,
            user: props.user,
        };
    }

    render() {
        const props = this.props;

        return (
            <Panel id={props.id}>
                <PanelHeader
                // left={<PanelHeaderButton onClick={props.go} data-to="home">
                //     {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                // </PanelHeaderButton>}
                >
                    Настройки
				</PanelHeader>
             </Panel>
        );
    }
}

export default ClientOptions;