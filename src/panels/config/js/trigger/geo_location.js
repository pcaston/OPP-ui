import { Component } from "preact";
import "@polymer/paper-radio-button/paper-radio-button";
import "@polymer/paper-radio-group/paper-radio-group";
import "../../../../components/entity/op-entity-picker";
import { onChangeEvent } from "../../../../common/preact/event";
export default class GeolocationTrigger extends Component {
    constructor() {
        super();
        this.onChange = onChangeEvent.bind(this, "trigger");
        this.zonePicked = this.zonePicked.bind(this);
        this.radioGroupPicked = this.radioGroupPicked.bind(this);
    }
    zonePicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.trigger, { zone: ev.target.value }));
    }
    radioGroupPicked(ev) {
        this.props.onChange(this.props.index, Object.assign({}, this.props.trigger, { event: ev.target.selected }));
    }
    /* eslint-disable camelcase */
    render({ trigger, opp }) {
        const { source, zone, event } = trigger;
        return -input;
        label = {
            "ui.panel.config.automation.editor.triggers.type.geo_location.source": 
        };
        name = "source";
        value = { source };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < op - entity - picker;
        label = {
            "ui.panel.config.automation.editor.triggers.type.geo_location.zone": 
        };
        value = { zone };
        onChange = { this: .zonePicked };
        opp = { opp };
        allowCustomEntity;
        domainFilter = "zone"
            /  >
            id;
        "eventlabel" >
            {
                "ui.panel.config.automation.editor.triggers.type.geo_location.event": 
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
        name = "enter" >
            {
                "ui.panel.config.automation.editor.triggers.type.geo_location.enter": 
            }
            < /paper-radio-button>
            < paper - radio - button;
        name = "leave" >
            {
                "ui.panel.config.automation.editor.triggers.type.geo_location.leave": 
            }
            < /paper-radio-button>
            < /paper-radio-group>
            < /div>;
        ;
    }
}
GeolocationTrigger.defaultConfig = {
    source: "",
    zone: "",
    event: "enter",
};
//# sourceMappingURL=geo_location.js.map