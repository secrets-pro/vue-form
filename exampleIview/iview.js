import Vue from "vue";
import {
  Badge,
  Affix,
  Modal,
  Cascader,
  DatePicker,
  TimePicker,
  Upload,
  //Spin,
  // LoadingBar,
  Steps,
  Step,
  Switch,
  Input,
  Select,
  Option,
  OptionGroup,
  Form,
  FormItem,
  Col,
  Row,
  Tag,
  Checkbox,
  CheckboxGroup,
  InputNumber,
  Tooltip,
  RadioGroup,
  Radio,
  Icon,
  Time,
  BackTop,
  TabPane,
  Tabs,
  Collapse,
  Panel,
  Notice,
  Drawer,
  Progress,
  Tree,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Table,
  Button
} from "view-design";
let components = {
  Badge,
  Affix,
  Upload,
  Cascader,
  DatePicker,
  TimePicker,
  //Spin,
  // LoadingBar,
  Steps,
  Step,
  TabPane,
  Tabs,
  Modal,
  Tag,
  Select,
  Option,
  OptionGroup,
  Form,
  FormItem,
  Col,
  Input,
  Row,
  Checkbox,
  CheckboxGroup,
  InputNumber,
  Tooltip,
  RadioGroup,
  Radio,
  Icon,
  Time,
  BackTop,
  Collapse,
  Panel,
  Notice,
  Drawer,
  Progress,
  Tree,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Table,
  Button
};

Object.keys(components).forEach((el) => {
  Vue.component(el, components[el]);
  let name = "i" + el.replace(/([A-Z])/g, "-$1").toLowerCase();
  Vue.component(name, components[el]);
});
Vue.component("i-switch", Switch);
