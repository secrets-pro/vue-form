export default {
  language: "json",
  format: "yyyy-MM-dd",
  options: {
    elementUI: false,
    iView: false
  },
  extraOptions(description) {
    let rtn = {};
    try {
      rtn = JSON.parse(description);
    } catch (error) {
      // 不是json
      // rtn.title = description;
      rtn.description = description;
    }
    return rtn;
  },
  formatDate(date) {
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let d = date.getDate();
    return y + "-" + (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);
  }
};
