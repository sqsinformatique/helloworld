import React from 'react';
import { Panel, PanelHeader, PanelHeaderButton} from '@vkontakte/vkui';
import { platform, IOS } from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osName = platform();

class CourierOptions extends React.Component {
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
                left={<PanelHeaderButton onClick={props.go} data-to="home">
                    {osName === IOS ? <Icon28ChevronBack /> : <Icon24Back />}
                </PanelHeaderButton>}
                >
                    Настройки
				</PanelHeader>
             </Panel>
        );
    }
}

export default CourierOptions;