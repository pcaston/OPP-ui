import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-radio-button/paper-radio-button";
import "@polymer/paper-radio-group/paper-radio-group";
import { onChangeEvent } from "../../../../common/preact/event";
export default class SunTrigger extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "trigger");
        this.radioGroupPicked = this.radioGroupPicked.bind(this);
    }
    radioGroupPicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.trigger, { event: ev.target.selected }));
    }
    /* eslint-disable camelcase */
    render({ trigger }) {
        const { offset, event } = trigger;
        return id = "eventlabel" >
            {
                "ui.panel.config.automation.editor.triggers.type.sun.event": 
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
        name = "sunrise" >
            {
                "ui.panel.config.automation.editor.triggers.type.sun.sunrise": 
            }
            < /paper-radio-button>
            < paper - radio - button;
        name = "sunset" >
            {
                "ui.panel.config.automation.editor.triggers.type.sun.sunset": 
            }
            < /paper-radio-button>
            < /paper-radio-group>
            < paper - input;
        label = {
            "ui.panel.config.automation.editor.triggers.type.sun.offset": 
        };
        name = "offset";
        value = { offset };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < /div>;
        ;
    }
}
SunTrigger.defaultConfig = {
    event: "sunrise",
};
//# sourceMappingURL=sun.js.map