import { h, Component } from "preact";

import "@polymer/paper-input/paper-input";
import "../op-config-section";
import "../../../components/op-card";

import Script from "./script/index";

export default class ScriptEditor extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.sequenceChanged = this.sequenceChanged.bind(this);
  }

  onChange(ev) {
    this.props.onChange(
      Object.assign({}, this.props.script, {
        [ev.target.name]: ev.target.value,
      })
    );
  }

  sequenceChanged(sequence) {
    this.props.onChange(Object.assign({}, this.props.script, { sequence }));
  }

  render({ script, isWide, opp }) {
    const { alias, sequence } = script;

    return (
      <div>
        <op-config-section is-wide={isWide}>
          <span slot="header">{alias}</span>
          <span slot="introduction">
            Use scripts to execute a sequence of actions.
          </span>
          <op-card>
            <div class="card-content">
              <paper-input
                label="Name"
                name="alias"
                value={alias}
                onvalue-changed={this.onChange}
              />
            </div>
          </op-card>
        </op-config-section>

        <op-config-section is-wide={isWide}>
          <span slot="header">Sequence</span>
          <span slot="introduction">
            The sequence of actions of this script.
            <p>
              <a href="https://open-peer-power.io/docs/scripts/" target="_blank">
                Learn more about available actions.
              </a>
            </p>
          </span>
          <Script
            script={sequence}
            onChange={this.sequenceChanged}
            opp={opp}
          />
        </op-config-section>
      </div>
    );
  }
}
