/**
 * Created by Administrator on 2017/7/25 0025.
 */
var data = require('./dataSet/data.json');

let Page = function () {
  this.data = data;
};
Page.prototype = {
  constructor: Page,
  getItem(obj){
    return `<li class="item">
              <h5 class="title">${obj.title}</h5>
              <p class="content">${obj.content}</p>
            </li>`;
  },
  getHtml(){
    let str = '<div class="outer" ><ul class="list scroll">';
    this.data.forEach((item) => {
      str += this.getItem(item);
    });
    str += '</ul></div>';
    return str;
  }
};
module.exports = Page;