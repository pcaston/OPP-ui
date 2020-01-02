import { Component } from "preact";
import "../../../../components/op-textarea";
import { onChangeEvent } from "../../../../common/preact/event";
export default class TemplateTrigger extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "trigger");
    }
    render({ trigger }) {
        /* eslint-disable camelcase */
        const { value_template } = trigger;
        return -textarea;
        label = {
            "ui.panel.config.automation.editor.triggers.type.template.value_template": 
        };
        name = "value_template";
        value = { value_template };
        onvalue - changed;
        {
            this.onChange;
        }
        dir = "ltr"
            /  >
            /div>;
        ;
    }
}
TemplateTrigger.defaultConfig = {
    value_template: "",
};
//# sourceMappingURL=template.js.map