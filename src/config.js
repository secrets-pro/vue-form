export default {
  language: "json",
  format: "yyyy-MM-dd",
  options:{
    elementUI:true,
    IView:false
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
  }
};
