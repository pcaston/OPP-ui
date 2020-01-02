import { Component } from "preact";
import "../../../../components/op-textarea";
import { onChangeEvent } from "../../../../common/preact/event";
export default class TemplateCondition extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "condition");
    }
    render({ condition }) {
        /* eslint-disable camelcase */
        const { value_template } = condition;
        return -textarea;
        label = {
            "ui.panel.config.automation.editor.conditions.type.template.value_template": 
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
TemplateCondition.defaultConfig = {
    value_template: "",
};
//# sourceMappingURL=template.js.map