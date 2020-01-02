import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import "../../../../components/entity/op-entity-picker";
import { onChangeEvent } from "../../../../common/preact/event";
export default class StateCondition extends Component {
    constructor() {
        super();
        this.defaultConfig = {
            entity_id: "",
            state: "",
        };
        this.onChange = onChangeEvent.bind(this, "condition");
        this.entityPicked = this.entityPicked.bind(this);
    }
    entityPicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.condition, { entity_id: ev.target.value }));
    }
    /* eslint-disable camelcase */
    render({ condition, opp }) {
        const { entity_id, state } = condition;
        const cndFor = condition.for;
        return (-entity - picker);
        value = { entity_id };
        onChange = { this: .entityPicked };
        opp = { opp };
        allowCustomEntity
            /  >
            -input;
        label = {
            "ui.panel.config.automation.editor.conditions.type.state.state": 
        };
        name = "state";
        value = { state };
        onvalue - changed;
        {
            this.onChange;
        }
        />;
        {
            cndFor && For;
            {
                JSON.stringify(cndFor, null, 2);
            }
            /pre>}
                < /div>;
            ;
        }
    }
}
//# sourceMappingURL=state.js.map