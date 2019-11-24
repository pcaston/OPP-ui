import { h, Component } from "preact";

import "@polymer/paper-input/paper-input";

import { onChangeEvent } from "../../../../common/preact/event";

export default class TimeTrigger extends Component {
  constructor() {
    super();

    this.onChange = onChangeEvent.bind(this, "trigger");
  }

  /* eslint-disable camelcase */
  render({ trigger }) {
    const { at } = trigger;
    return (
      <div>
        <paper-input
          label={
            "ui.panel.config.automation.editor.triggers.type.time.at"
          }
          name="at"
          value={at}
          onvalue-changed={this.onChange}
        />
      </div>
    );
  }
}

TimeTrigger.defaultConfig = {
  at: "",
};
