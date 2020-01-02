import { Component } from "preact";
import "@material/mwc-button";
import "../../../../components/op-card";
import StateTrigger from "./state";
export default class Trigger extends Component {
    constructor() {
        super();
        this.addTrigger = this.addTrigger.bind(this);
        this.triggerChanged = this.triggerChanged.bind(this);
    }
    addTrigger() {
        const trigger = this.props.trigger.concat(Object.assign({ platform: "state" }, StateTrigger.defaultConfig));
        this.props.onChange(trigger);
    }
    triggerChanged(index, newValue) {
        const trigger = this.props.trigger.concat();
        if (newValue === null) {
            trigger.splice(index, 1);
        }
        else {
            trigger[index] = newValue;
        }
        this.props.onChange(trigger);
    }
    render({ trigger, opp }) {
        return class {
        } = "triggers" >
            { trigger, : .map((trg, idx) => index = { idx }, trigger = { trg }, onChange = { this: .triggerChanged }, opp = { opp }
                    /  >
                ) }
            < op - card >
            class {
            };
        "card-actions add-card" >
            -button;
        onTap = { this: .addTrigger } >
            { "ui.panel.config.automation.editor.triggers.add":  }
            < /mwc-button>
            < /div>
            < /op-card>
            < /div>;
        ;
    }
}
//# sourceMappingURL=index.js.map