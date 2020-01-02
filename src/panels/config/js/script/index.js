import { Component } from "preact";
import "@material/mwc-button";
import "../../../../components/op-card";
export default class Script extends Component {
    constructor() {
        super();
        this.addAction = this.addAction.bind(this);
        this.actionChanged = this.actionChanged.bind(this);
    }
    addAction() {
        const script = this.props.script.concat({
            service: "",
        });
        this.props.onChange(script);
    }
    actionChanged(index, newValue) {
        const script = this.props.script.concat();
        if (newValue === null) {
            script.splice(index, 1);
        }
        else {
            script[index] = newValue;
        }
        this.props.onChange(script);
    }
    render({ script, opp }) {
        return class {
        } = "script" >
            { script, : .map((act, idx) => index = { idx }, action = { act }, onChange = { this: .actionChanged }, opp = { opp }
                    /  >
                ) }
            < op - card >
            class {
            };
        "card-actions add-card" >
            -button;
        onTap = { this: .addAction } >
            { "ui.panel.config.automation.editor.actions.add":  }
            < /mwc-button>
            < /div>
            < /op-card>
            < /div>;
        ;
    }
}
//# sourceMappingURL=index.js.map