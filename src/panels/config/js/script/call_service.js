import { Component } from "preact";
import "../../../../components/op-service-picker";
export default class CallServiceAction extends Component {
    constructor() {
        super();
        this.serviceChanged = this.serviceChanged.bind(this);
        this.serviceDataChanged = this.serviceDataChanged.bind(this);
    }
    serviceChanged(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.action, { service: ev.target.value }));
    }
    serviceDataChanged(data) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.action, { data }));
    }
    render({ action, opp }) {
        const { service, data } = action;
        return (-service - picker);
        opp = { opp };
        value = { service };
        onChange = { this: .serviceChanged }
            /  >
            label;
        {
            "ui.panel.config.automation.editor.actions.type.service.service_data";
        }
        value = { data };
        onChange = { this: .serviceDataChanged }
            /  >
            /div>;
        ;
    }
}
CallServiceAction.defaultConfig = {
    alias: "",
    service: "",
    data: {},
};
//# sourceMappingURL=call_service.js.map