import { Component } from "preact";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu-light";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-listbox/paper-listbox";
import EventTrigger from "./event";
import GeolocationTrigger from "./geo_location";
import OppTrigger from "./openPeerPower";
import MQTTTrigger from "./mqtt";
import NumericStateTrigger from "./numeric_state";
import TimePatternTrigger from "./time_pattern";
import StateTrigger from "./state";
import SunTrigger from "./sun";
import TemplateTrigger from "./template";
import TimeTrigger from "./time";
import WebhookTrigger from "./webhook";
import ZoneTrigger from "./zone";
const TYPES = {
    event: EventTrigger,
    state: StateTrigger,
    geo_location: GeolocationTrigger,
    openPeerPower: OppTrigger,
    mqtt: MQTTTrigger,
    numeric_state: NumericStateTrigger,
    sun: SunTrigger,
    template: TemplateTrigger,
    time: TimeTrigger,
    time_pattern: TimePatternTrigger,
    webhook: WebhookTrigger,
    zone: ZoneTrigger,
};
const OPTIONS = Object.keys(TYPES).sort();
export default class TriggerEdit extends Component {
    constructor() {
        super();
        this.typeChanged = this.typeChanged.bind(this);
    }
    typeChanged(ev) {
        const type = ev.target.selectedItem.attributes.platform.value;
        if (type !== this.props.trigger.platform) {
            this.props.onChange(this.props.index, Object.assign({ platform: type }, TYPES[type].defaultConfig));
        }
    }
    render({ index, trigger, onChange, opp }) {
        const Comp = TYPES[trigger.platform];
        const selected = OPTIONS.indexOf(trigger.platform);
        if (!Comp) {
            return ({
                "ui.panel.config.automation.editor.triggers.unsupported_platform": ,
                "platform": ,
                trigger, : .platform
            }
                < pre > { JSON, : .stringify(trigger, null, 2) } < /pre>
                < /div>);
        }
        return (-dropdown - menu - light);
        label = {
            "ui.panel.config.automation.editor.triggers.type_select": 
        };
        no - animations
            >
                -listbox;
        slot = "dropdown-content";
        selected = { selected };
        oniron - select;
        {
            this.typeChanged;
        }
            >
                { OPTIONS, : .map((opt) => -item, platform = { opt } >
                        {} `ui.panel.config.automation.editor.triggers.type.${opt}.label`)
                }
            < /paper-item>;
    }
}
/paper-listbox>
    < /paper-dropdown-menu-light>
    < Comp;
index = { index };
trigger = { trigger };
onChange = { onChange };
opp = { opp }
    /  >
    /div>;
;
//# sourceMappingURL=trigger_edit.js.map