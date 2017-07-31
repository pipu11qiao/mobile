/**
 * Created by Administrator on 2017/7/25 0025.
 */
// 样式文件
let resetStyle = require('./css/reset.css');
let pageStyle = require('./css/page.css');

// js 文件
import $ from 'jquery';

let Page = require('./js/pageInit');
let setRem = require('./js/setRem'); // rem 设置
let Scroll = require('./js/scroll'); // scroll

setRem(window); // 控制页面 rem单位

// 初始页面
let pageObj = new Page();
$(document.body).html(pageObj.getHtml());

// 封装 scroll
let scrollObj = new Scroll({
  el: $('.scroll')
});
console.log(scrollObj);
if(DEVELOPMENT) {
  if(module.hot) {
    module.hot.accept();
  }
}
