export function renderSelectOptions(h, options = [], groups, prefix) {
  if (groups) {
    return options.map((el) => {
      return h(
        `${prefix}-option-group`,
        {
          props: {
            label: el.label
          }
        },
        el.options.map((op) => {
          // 检查 options
          return h(`${prefix}-option`, {
            props: {
              label: op.label,
              value: op.value
            }
          });
        })
      );
    });
  }
  return options.map((el) => {
    return h(`${prefix}-option`, {
      props: {
        label: el.label,
        value: el.value
      }
    });
  });
}

export function renderRadioCheckbox(h, type, options = [], prefix) {
  // option [{ label: "类型1", value: "type1"}] ==> option[1.2] enum[1,2] enumNames["xx","yyy"]
  return options.map((el) => {
    return h(
      `${prefix}-${type}`,
      {
        props: {
          label: el.value
        }
      },
      el.label
    );
  });
}
