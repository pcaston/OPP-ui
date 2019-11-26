import { h, Component } from "preact";
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
    if (
      confirm(
          "ui.panel.config.automation.editor.conditions.delete_confirm"
      )
    ) {
      this.props.onChange(this.props.index, null);
    }
  }

  render(props) {
    return (
      <op-card>
        <div class="card-content">
          <div class="card-menu">
            <paper-menu-button
              no-animations
              horizontal-align="right"
              horizontal-offset="-5"
              vertical-offset="-5"
            >
              <paper-icon-button
                icon="opp:dots-vertical"
                slot="dropdown-trigger"
              />
              <paper-listbox slot="dropdown-content">
                <paper-item disabled>
                  {"ui.panel.config.automation.editor.conditions.duplicate"
                  }
                </paper-item>
                <paper-item onTap={this.onDelete}>
                  {"ui.panel.config.automation.editor.conditions.delete"
                  }
                </paper-item>
              </paper-listbox>
            </paper-menu-button>
          </div>
          <ConditionEdit {...props} />
        </div>
      </op-card>
    );
  }
}
