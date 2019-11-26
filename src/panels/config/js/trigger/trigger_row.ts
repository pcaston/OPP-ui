import { h, Component } from "preact";
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
    if (
      confirm(
        this.props(
          "ui.panel.config.automation.editor.triggers.delete_confirm"
        )
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
                  {props(
                    "ui.panel.config.automation.editor.triggers.duplicate"
                  )}
                </paper-item>
                <paper-item onTap={this.onDelete}>
                  {props(
                    "ui.panel.config.automation.editor.triggers.delete"
                  )}
                </paper-item>
              </paper-listbox>
            </paper-menu-button>
          </div>
          <TriggerEdit {...props} />
        </div>
      </op-card>
    );
  }
}
