'use strict';
/**
 ************************************************************************
 * ice.drag(拖动排序插件)
 * 作者：闫立峰
 * 官网：https://iceui.cn
 * 创建：2020-07-02
 * 更新：2022-04-27
 * MIT License By iceui.cn
 ************************************************************************
 * 版权声明：该版权完全归ICEUI官方所有，可转载使用和学习，但请务必保留版权信息
 ************************************************************************
 */

/**
 * options   {json}
 *  ├ obj    {object}   对象
 *  ├ item   {string}   该对象下需要拖动的class
 *  ├ time   {int}      动画特效时间，单位ms（毫秒）
 *  └ func   {function} 回调函数，位置变换后调用该函数
 *------------------------------------------------------------------------------------*
 */
var ice = ice || {};
ice.drag = function(options) {
	options = options || {};
	var obj = options.obj[0]?options.obj[0]:options.obj,
		time = options.time || 500,
		func = options.func ||
	function() {}, dragW = obj.offsetWidth, dragH = obj.offsetHeight, iceDrag = obj.children, posArr = [], objArr = [], grid = [],
	//获取对象外边距函数
	getMargin = function(obj, attr) {
		return obj.currentStyle ? parseInt(obj.currentStyle[attr]) : parseInt(document.defaultView.getComputedStyle(obj, null)[attr])
	},
	//获取item的宽高
	itemW = iceDrag[0].offsetWidth + getMargin(iceDrag[0], 'marginLeft') + getMargin(iceDrag[0], 'marginRight'), itemH = iceDrag[0].offsetHeight + getMargin(iceDrag[0], 'marginTop') + getMargin(iceDrag[0], 'marginBottom');
	//网格系统定位-整个drag的核心
	for (var i = 0; i < iceDrag.length; i++) {
		grid[i] = {
			l: iceDrag[i].offsetLeft - getMargin(iceDrag[i], 'marginLeft'),
			t: iceDrag[i].offsetTop - getMargin(iceDrag[i], 'marginTop')
		}
	}
	//排序
	for (var i = 0; i < iceDrag.length; i++) {
		iceDrag[i].setAttribute('index', i), posArr.push(i)
	}
	//自定义函数
	var ice = {
		s: null,
		//获取边距
		getMargin: function(obj, attr) {
			return obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr];
		},
		//获取坐标
		getPos: function(t, l) {
			if ((t + itemH) <= 0 || (t + itemH / 2) >= dragH) return false;
			if ((l + itemW) <= 0 || (l + itemW / 2) >= dragW) return false;
			t += itemH / 2;
			l += itemW / 2;
			for (var i = 0; i < grid.length; i++) {
				if (t > grid[i].t && t < grid[i].t + itemH && l > grid[i].l && l < grid[i].l + itemW) {
					return {
						't': t,
						'l': l,
						's': i
					};
				}
			}
			return false
		},
		//同样的值只运行一次
		oneRun: function(s) {
			if (ice.s === s) {
				return false;
			} else {
				ice.s = s;
				return true;
			}
		},
		//重新排序数组
		order: function(a, b) {
			var arr = [].concat(posArr);
			if (a < b) {
				for (var i = a; i < b; i++) {
					arr[i] = posArr[i + 1];
					var p = posArr[i + 1];
					iceDrag[p].style.left = grid[i].l + 'px';
					iceDrag[p].style.top = grid[i].t + 'px';
				}
			} else {
				for (var i = b; i < a; i++) {
					arr[i + 1] = posArr[i];
					var p = posArr[i];
					iceDrag[p].style.left = grid[i + 1].l + 'px';
					iceDrag[p].style.top = grid[i + 1].t + 'px';
				}
			}
			arr[b] = posArr[a];
			posArr = arr;
		},
	}

	for (var i = 0; i < iceDrag.length; i++) {
		objArr.push(iceDrag[i]);
		iceDrag[i].i = i;
		//自由拖拽排序
		iceDrag[i].onmousedown = function(ev) {
			var that = this;
			if(that.className){
				that.className += ' drag-click';
			}else{
				that.className = 'drag-click';
			}
			obj.style.width = dragW + 'px';
			obj.style.height = dragH + 'px';
			this.style.position = 'relative';
			var l = this.offsetLeft - getMargin(this, 'marginLeft'),
				t = this.offsetTop - getMargin(this, 'marginTop'),
				x = event.clientX - l,
				y = event.clientY - t,
				z = this,
				pos = ice.getPos(t, l),
				oldPosArr = [].concat(posArr),
				oldInfo = pos ? pos : false;
			ice.s = pos.s;
			this.style.position = 'absolute';
			this.style.left = l + 'px';
			this.style.top = t + 'px';
			this.style.zIndex = 99999;
			this.style.transition = 'none';
			//格式化所有item位置
			for (var a = 0; a < posArr.length; a++) {
				if (this.i !== posArr[a]) {
					var o = iceDrag[posArr[a]];
					o.style.position = 'absolute';
					o.style.left = grid[a].l + 'px';
					o.style.top = grid[a].t + 'px';
					o.style.transition = 'all ' + time + 'ms';
					o.style.transform = 'translate3d(0,0,0)';
				}
			}
			document.onmousemove = function(ev) {
				l = event.clientX - x;
				t = event.clientY - y;
				z.style.left = l + 'px';
				z.style.top = t + 'px';
				//防止动画未结束就执行排序，所以要设置一个时间
				var move = ice.getPos(t, l);
				if (move) {
					if (ice.oneRun(move.s)) { //当该item的位置发生变化时才会执行下面
						ice.order(pos.s, move.s);
						pos = move; //pos重新赋值

					}
				}
			};
			document.onmouseup = function(ev) {
				if(iceDrag.length === objArr.length){
					iceDrag = objArr;
				}else{
					iceDrag = obj.children, posArr = [], objArr = [], grid = [];
					grid=[];
					//网格系统定位-整个drag的核心
					for (var i = 0; i < iceDrag.length; i++) {
						grid[i] = {
							l: iceDrag[i].offsetLeft - getMargin(iceDrag[i], 'marginLeft'),
							t: iceDrag[i].offsetTop - getMargin(iceDrag[i], 'marginTop')
						}
					}
					posArr = [];
					//排序
					for (var i = 0; i < iceDrag.length; i++) {
						iceDrag[i].setAttribute('index', i), posArr.push(i)
					}
				}
					
				var css = that.className.split('drag-click');
				that.className = css[0].replace(/(^\s*)|(\s*$)/g,'');//去除前后空格
				z.style.transition = 'all ' + time + 'ms';
				var newPos = ice.getPos(t, l);
				if (newPos) {
					z.style.top = grid[newPos.s].t + 'px';
					z.style.left = grid[newPos.s].l + 'px';
				} else {
					z.style.top = pos.t + 'px';
					z.style.left = pos.l + 'px';
				}
				//视图重新排序
				for (var ia = 0; ia < posArr.length; ia++) {
					iceDrag[posArr[ia]].style.left = grid[ia].l + 'px';
					iceDrag[posArr[ia]].style.top = grid[ia].t + 'px';
				}


				//对象重新排序
				setTimeout(function() {
					obj.style.width = null;
					obj.style.height = null;

					var arr = [];
					for (var ia = 0; ia < posArr.length; ia++) {
						iceDrag[posArr[ia]].removeAttribute('style');
						iceDrag[posArr[ia]].setAttribute('index', ia);
						arr.push(iceDrag[posArr[ia]]);
						obj.appendChild(iceDrag[posArr[ia]]);
					}
					//回调函数
					func({
						pos: newPos ? newPos.s : pos.s,
						//新的位置
						oldPos: oldInfo ? oldInfo.s : false,
						//之前的位置
						posArr: posArr,
						//所有的新位置数组
						oldPosArr: oldPosArr,
						//所有的旧位置数组
						obj: z,
						//当前移动的对象
						oldObj: newPos ? iceDrag[oldPosArr[newPos.s]] : z,
						//被替换的对象
						objList: arr,
						//对象列表
						info: newPos ? newPos : pos,
						//新位置 行和列以及当前位置信息
						oldInfo: oldInfo,
						//旧位置 行和列以及当前位置信息
					});
				}, time);
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		}
	}
};