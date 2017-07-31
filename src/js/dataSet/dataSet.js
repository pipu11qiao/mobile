//-->> Created by pipu on 2017/7/23.
// 树结构数据 和 互斥数据 的生成 互斥数据中的id需要在生成树结构数据的时候进行记录
let fs = require('fs');
let path = require('path');
const NUM = 90; // 控制菜单数量

const PRETITLE = '测试标题';
const PRECONTENT = '内容';

let data = [];

for (let i = 0; i < NUM; i++) {
  data.push({
    title: PRETITLE + i,
    content: PRECONTENT + i
  });
}
fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(data), 'utf-8', function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('写数据成功！');
});
