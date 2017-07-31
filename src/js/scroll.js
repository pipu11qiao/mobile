/**
 * Created by Administrator on 2017/7/26 0026.
 */
// 接受图片地址在页面渲染 更新图片

import $ from 'jquery';

let jQueryPreset = require('./preset');

jQueryPreset($);
let start = $.touchEvents.start;
let move = $.touchEvents.move;
let end = $.touchEvents.end;
let isPhone = $.support.touch;
let getTarget = function (e) {
  if (isPhone) {
    return e.changedTouches[0];
  }
  return e;
};
// @imgArr 左右图片的路径 cb 如果渲染图片过程中出现错误怎么处理
let Scroll = function (options) {
  this.$el = options.el; // jquery对象
  this.height = this.$el.outerHeight() - $(document.body).height();
  this.isMoving = false; // 是否在移动
  this.isInit = true; // 是否是初始化 区分初始和更新
  this.isStart = false;
  this.minDistance = 2;
  this.firstY = 0;
  this.preY = 0;
  this.duration = 200;
  this.hasMoved = false;
  this.preTime = 0;
  this.velocity = 0;
  this.acceleration = 0.005; // 加速度；px^2 / ms
  this.moveId = null;
  this.init();
};
Scroll.prototype = {
  constructor: Scroll,
  init(){
    console.log(this.height);
    this.bind();
  },

  move: function (distance, type) {
    // type 为true 是动效，为 false 无动效
    this.$el.transition(type ? this.duration : 0);
    if (type) {
      let clientLeft = this.$el[0].clientLeft;
    }
    this.$el.transformY(distance);
  },
  scrollMove() {
    // 根据当前位置判断是第几个，移动过去，并且对应上图标。
    this.isScollMove = true;
    this.moveId = $.requestAnimationFrame(() => {
      this.moveTime = Date.now();
      this.autoMove();
    });

  },
  cancelMove(){
    console.log('cancel scroll move');
    $.cancelAnimationFrame(this.moveId);
    this.moveId = null;
    this.isScollMove = false;
    // 判断当前的y 如果>0 返回0
    let cuY = $.getTranslate(this.$el[0], 'y');
    console.log()
    if(cuY > 0) {
      this.move(0,true);
    } else if ( cuY < -this.height) {
      this.move(-this.height,true);
    }
  },
  autoMove() {
     let curTime = Date.now();
     let time = curTime - this.moveTime; // 间隔时间 ms
     this.moveTime = curTime;

     let direction = this.velocity > 0 ? 1 : -1;
     // console.log(this.velocity);
     let curVelocity = this.velocity - direction * this.acceleration * time;
     let distance = (this.velocity + curVelocity) * time / 2;
     this.velocity = curVelocity;
      let cuY = $.getTranslate(this.$el[0], 'y');
      this.$el.transformY(cuY + distance );
     if(Math.abs(this.velocity) <= 0.08 || this.isScollMove === false) {
       this.cancelMove();
     } else {
       this.moveId = $.requestAnimationFrame(() => {
         this.autoMove();
       });
     }
  }
  ,
  bind(){
    // 给ul元素绑定事件
    this.$el.on(start, e => {
      e.preventDefault();
      let target = getTarget(e);
      this.isStart = true;
      this.firstY = target.clientY;
      this.preY = target.clientY;
      this.delTime = Date.now();

      if(this.isScollMove){
        this.hasMoved = false;
        this.cancelMove();
      }
    }).on(end, e => {
      e.preventDefault();
      let target = getTarget(e);
      this.isStart = false;
      if(this.hasMoved) {
        // 计算速度
        let delDistance = this.preY - this.prepreY;
        let delTime = this.preTime - this.prepreTime;
        this.velocity = delDistance / delTime; // 速度 每毫秒移动的px
        this.scrollMove();
      }
    }).on(move, e => {
      let target = getTarget(e);
      if (this.isStart && !this.isMoving) {
        let delY = parseInt(target.clientY - this.preY);
        // 获得 ul的translate 并实时改变
        let cuY = $.getTranslate(this.$el[0], 'y');
        if (Math.abs(delY) > this.minDistance) {
          if(!this.hasMoved) {
            this.hasMoved = true;
          }
          this.prepreY = this.preY;
          this.preY = target.clientY;
          this.prepreTime = this.preTime;
          this.preTime = Date.now();
          this.move(cuY + delY, false);
        }

      }
    }).on('mouseout', () => {
      this.isStart = false;
    }).on('transitionend', e => {
      this.isMoving = false;
      console.log('transition end');
    })
  }
};

module.exports = Scroll;
