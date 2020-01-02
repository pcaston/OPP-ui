import { Component } from "preact";
import "@polymer/paper-radio-button/paper-radio-button";
import "@polymer/paper-radio-group/paper-radio-group";
export default class OpssTrigger extends Component {
    constructor() {
        super();
        this.radioGroupPicked = this.radioGroupPicked.bind(this);
    }
    radioGroupPicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.trigger, { event: ev.target.selected }));
    }
    /* eslint-disable camelcase */
    render({ trigger }) {
        const { event } = trigger;
        return id = "eventlabel" >
            {
                "ui.panel.config.automation.editor.triggers.type.openPeerPower.event": 
            }
            < /label>
            < paper - radio - group;
        selected = { event };
        aria - labelledby;
        "eventlabel";
        onpaper - radio - group - changed;
        {
            this.radioGroupPicked;
        }
            >
                -radio - button;
        name = "start" >
            {
                "ui.panel.config.automation.editor.triggers.type.openPeerPower.start": 
            }
            < /paper-radio-button>
            < paper - radio - button;
        name = "shutdown" >
            {
                "ui.panel.config.automation.editor.triggers.type.openPeerPower.shutdown": 
            }
            < /paper-radio-button>
            < /paper-radio-group>
            < /div>;
        ;
    }
}
OpssTrigger.defaultConfig = {
    event: "start",
};
//# sourceMappingURL=homeassistant.js.map