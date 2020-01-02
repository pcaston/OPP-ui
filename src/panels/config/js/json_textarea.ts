import { h, Component } from "preact";
import '../../components/op-textarea';

interface Aev {
  target: {value: string},
};
interface AppProps {
  name: string,
  value: string,
  optionalValue?: string,
  onChange(ev: Aev): string,
};

interface AppState {
  name: string,
  useOptional: boolean,
  isValid: boolean,
  value: string,
};

export default class JSONTextArea extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state.isValid = true;
    this.state.value = JSON.stringify(props.value || {}, null, 2);

    this.onChange = this.onChange.bind(this);
  };

  onChange(ev: Aev) {
    const value = ev.target.value;
    let parsed;
    let isValid;

    try {
      parsed = JSON.parse(value);
      isValid = true;
    } catch (err) {
      // Invalid JSON
      isValid = false;
    }

    this.setState({
      value,
      isValid,
    });
    if (isValid) {
      this.props.onChange(parsed);
    }
  }

  componentWillReceiveProps({ value }) {
    if (value === this.props.value) return;
    this.setState({
      value: JSON.stringify(value, null, 2),
      isValid: true,
    });
  }

  render({ label }, { value, isValid }) {
    const style = {
      minWidth: 300,
      width: "100%",
    };
    if (!isValid) {
      style.border = "1px solid red";
    }
    return (
      <op-textarea
        label={label}
        value={value}
        style={style}
        onvalue-changed={this.onChange}
        dir="ltr"
      />
    );
  }
}
