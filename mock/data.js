import Mock from "mockjs";

const Random = Mock.Random;

var listData = function() {
  let _data = [];
  for (let i = 0; i < 10; i++) {
    let newList = {
      label: Random.cword(2, 4), // 中文2-4个
      value: Random.integer(1, 100) + "", // 1-100之间随便
      author: Random.cname(), // 随机一个姓名
      date: Random.date() + " " + Random.time()
    };
    _data.push(newList);
  }
  return { data: _data, total: 10 };
};
Mock.mock("http://api.com/image/list", "post", listData());
