import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import "../../../../components/op-textarea";
import "../../../../components/entity/op-entity-picker";
import { onChangeEvent } from "../../../../common/preact/event";
export default class NumericStateCondition extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "condition");
        this.entityPicked = this.entityPicked.bind(this);
    }
    entityPicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.condition, { entity_id: ev.target.value }));
    }
    /* eslint-disable camelcase */
    render({ condition, opp }) {
        const { value_template, entity_id, below, above } = condition;
        return (-entity - picker);
        value = { entity_id };
        onChange = { this: .entityPicked };
        opp = { opp };
        allowCustomEntity
            /  >
            -input;
        label = { "ui.panel.config.automation.editor.conditions.type.numeric_state.above": 
        };
        name = "above";
        value = { above };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < paper - input;
        label = { "ui.panel.config.automation.editor.conditions.type.numeric_state.below": 
        };
        name = "below";
        value = { below };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < op - textarea;
        label = { "ui.panel.config.automation.editor.conditions.type.numeric_state.value_template": 
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
NumericStateCondition.defaultConfig = {
    entity_id: "",
};
//# sourceMappingURL=numeric_state.js.map