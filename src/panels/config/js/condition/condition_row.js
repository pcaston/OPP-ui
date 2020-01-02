import { Component } from "preact";
import "@polymer/paper-menu-button/paper-menu-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";
import "../../../../components/op-card";
import ConditionEdit from "./condition_edit";
export default class ConditionRow extends Component {
    constructor() {
        super();
        this.onDelete = this.onDelete.bind(this);
    }
    onDelete() {
        // eslint-disable-next-line
        if (confirm("ui.panel.config.automation.editor.conditions.delete_confirm")) {
            this.props.onChange(this.props.index, null);
        }
    }
    render(props) {
        return (-card >
            class {
            }) = "card-content" >
            class {
            };
        "card-menu" >
            -menu - button;
        no - animations;
        horizontal - align;
        "right";
        horizontal - offset;
        "-5";
        vertical - offset;
        "-5"
            >
                -icon - button;
        icon = "opp:dots-vertical";
        slot = "dropdown-trigger"
            /  >
            -listbox;
        slot = "dropdown-content" >
            -item;
        disabled >
            {}
            < /paper-item>
            < paper - item;
        onTap = { this: .onDelete } >
            {}
            < /paper-item>
            < /paper-listbox>
            < /paper-menu-button>
            < /div>
            < ConditionEdit;
        {
            props;
        }
        />
            < /div>
            < /op-card>;
        ;
    }
}
//# sourceMappingURL=condition_row.js.map