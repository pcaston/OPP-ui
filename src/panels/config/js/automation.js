import { Component } from "preact";
import "@polymer/paper-input/paper-input";
import "../op-config-section";
import "../../../components/op-card";
import Trigger from "./trigger/index";
import Condition from "./condition/index";
import Script from "./script/index";
export default class Automation extends Component {
    constructor() {
        super();
        this.onChange = { this: .conditionChanged };
        this.opp = { opp };
        this.localize = { localize }
            /  >
            /op-config-section>
            < op - config - section;
        this.onChange = this.onChange.bind(this);
        this.triggerChanged = this.triggerChanged.bind(this);
        this.conditionChanged = this.conditionChanged.bind(this);
        this.actionChanged = this.actionChanged.bind(this);
    }
    onChange(ev) {
        this.props.onChange(Object.assign({}, this.props.automation, {
            [ev.target.name]: ev.target.value,
        }));
    }
    triggerChanged(trigger) {
        this.props.onChange(Object.assign({}, this.props.automation, { trigger }));
    }
    conditionChanged(condition) {
        this.props.onChange(Object.assign({}, this.props.automation, { condition }));
    }
    actionChanged(action) {
        this.props.onChange(Object.assign({}, this.props.automation, { action }));
    }
    render({ automation, isWide, opp, localize }) {
        const { alias, trigger, condition, action } = automation;
        return (-config - section);
        is - wide;
        {
            isWide;
        }
         >
            slot;
        "header" > { alias } < /span>
            < span;
        slot = "introduction" >
            {}
            < /span>
            < op - card >
            class {
            };
        "card-content" >
            -input;
        label = {};
        name = "alias";
        value = { alias };
        onvalue - changed;
        {
            this.onChange;
        }
        />
            < /div>
            < /op-card>
            < /op-config-section>
            < op - config - section;
        is - wide;
        {
            isWide;
        }
         >
            slot;
        "header" >
            {}
            < /span>
            < span;
        slot = "introduction" >
            {}
            < /p>
            < a;
        href = "https://home-assistant.io/docs/automation/trigger/";
        target = "_blank"
            >
                {}
            < /a>
            < /span>
            < Trigger;
        trigger = { trigger };
        onChange = { this: .triggerChanged };
        opp = { opp };
        localize = { localize }
            /  >
            /op-config-section>
            < op - config - section;
        is - wide;
        {
            isWide;
        }
         >
            slot;
        "header" >
            {}
            < /span>
            < span;
        slot = "introduction" >
            {}
            < /p>
            < a;
        href = "https://home-assistant.io/docs/scripts/conditions/";
        target = "_blank"
            >
                {}
            < /a>
            < /span>
            < Condition;
        condition = { condition } || [];
    }
}
is - wide;
{
    isWide;
}
 >
    slot;
"header" >
    {}
    < /span>
    < span;
slot = "introduction" >
    {}
    < /p>
    < a;
href = "https://home-assistant.io/docs/automation/action/";
target = "_blank"
    >
        {}
    < /a>
    < /span>
    < Script;
script = { action };
onChange = { this: .actionChanged };
opp = { opp };
localize = { localize }
    /  >
    /op-config-section>
    < /div>;
;
//# sourceMappingURL=automation.js.map