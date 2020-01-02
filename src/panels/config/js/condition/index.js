import { Component } from "preact";
import "@material/mwc-button";
import "../../../../components/op-card";
export default class Condition extends Component {
    constructor() {
        super();
        this.addCondition = this.addCondition.bind(this);
        this.conditionChanged = this.conditionChanged.bind(this);
    }
    addCondition() {
        const condition = this.props.condition.concat({
            condition: "state",
        });
        this.props.onChange(condition);
    }
    conditionChanged(index, newValue) {
        const condition = this.props.condition.concat();
        if (newValue === null) {
            condition.splice(index, 1);
        }
        else {
            condition[index] = newValue;
        }
        this.props.onChange(condition);
    }
    render({ condition, opp }) {
        return class {
        } = "triggers" >
            { condition, : .map((cnd, idx) => index = { idx }, condition = { cnd }, onChange = { this: .conditionChanged }, opp = { opp }
                    /  >
                ) }
            < op - card >
            class {
            };
        "card-actions add-card" >
            -button;
        onTap = { this: .addCondition } >
            { "ui.panel.config.automation.editor.conditions.add":  }
            < /mwc-button>
            < /div>
            < /op-card>
            < /div>;
        ;
    }
}
//# sourceMappingURL=index.js.map