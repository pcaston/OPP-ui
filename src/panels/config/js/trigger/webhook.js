import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import { onChangeEvent } from "../../../../common/preact/event";
export default class WebhookTrigger extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "trigger");
    }
    render({ trigger }) {
        const { webhook_id: webhookId } = trigger;
        return -input;
        label = {
            "ui.panel.config.automation.editor.triggers.type.webhook.webhook_id": 
        };
        name = "webhook_id";
        value = { webhookId };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < /div>;
        ;
    }
}
WebhookTrigger.defaultConfig = {
    webhook_id: "",
};
//# sourceMappingURL=webhook.js.map