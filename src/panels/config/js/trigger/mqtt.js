import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import { onChangeEvent } from "../../../../common/preact/event";
export default class MQTTTrigger extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "trigger");
    }
    /* eslint-disable camelcase */
    render({ trigger }) {
        const { topic, payload } = trigger;
        return -input;
        label = {
            "ui.panel.config.automation.editor.triggers.type.mqtt.topic": 
        };
        name = "topic";
        value = { topic };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < paper - input;
        label = {
            "ui.panel.config.automation.editor.triggers.type.mqtt.payload": 
        };
        name = "payload";
        value = { payload };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < /div>;
        ;
    }
}
MQTTTrigger.defaultConfig = {
    topic: "",
};
//# sourceMappingURL=mqtt.js.map