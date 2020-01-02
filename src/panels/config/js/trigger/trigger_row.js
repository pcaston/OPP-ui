import { Component } from "preact";
import "@polymer/paper-menu-button/paper-menu-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";
import "../../../../components/op-card";
import TriggerEdit from "./trigger_edit";
export default class TriggerRow extends Component {
    constructor() {
        super();
        this.onDelete = this.onDelete.bind(this);
    }
    onDelete() {
        // eslint-disable-next-line
        if (confirm(this.props("ui.panel.config.automation.editor.triggers.delete_confirm"))) {
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
            < TriggerEdit;
        {
            props;
        }
        />
            < /div>
            < /op-card>;
        ;
    }
}
//# sourceMappingURL=trigger_row.js.map