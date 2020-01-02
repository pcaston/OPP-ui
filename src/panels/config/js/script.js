import { Component } from "preact";
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
        this.props.onChange(Object.assign({}, this.props.script, {
            [ev.target.name]: ev.target.value,
        }));
    }
    sequenceChanged(sequence) {
        this.props.onChange(Object.assign({}, this.props.script, { sequence }));
    }
    render({ script, isWide, opp, localize }) {
        const { alias, sequence } = script;
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
            Use;
        scripts;
        to;
        execute;
        a;
        sequence;
        of;
        actions.
            < /span>
            < op - card >
            class {
            };
        "card-content" >
            -input;
        label = "Name";
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
        "header" > Sequence < /span>
            < span;
        slot = "introduction" >
            The;
        sequence;
        of;
        actions;
        of;
        this;
        script.
            < p >
            href;
        "https://home-assistant.io/docs/scripts/";
        target = "_blank" >
            Learn;
        more;
        about;
        available;
        actions.
            < /a>
            < /p>
            < /span>
            < Script;
        script = { sequence };
        onChange = { this: .sequenceChanged };
        opp = { opp };
        localize = { localize }
            /  >
            /op-config-section>
            < /div>;
        ;
    }
}
//# sourceMappingURL=script.js.map