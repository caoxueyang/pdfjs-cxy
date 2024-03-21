/**
 * author:cxy
 * 
 * 
 */

function a() {
  var temp = document.getElementById('viewer').getElementsByClassName('page')

  console.log("aaaa111", temp)
  console.log("aaaa222", temp.length)
  var arr = []
  var box = document.getElementById('viewer')
  box.style.position = "relative"
  var pre = document.getElementsByClassName("cxy1")
  while (pre[0]) {
    pre[0].parentNode.removeChild(pre[0]);
  }
  for (let index = 0; index < temp.length; index++) {
    const element = temp[index];

    if (index == 0) {
      arr.push({
        height: element.clientHeight,
        width: element.clientWidth
      })
    } else {
      arr.push({
        height: arr[index - 1].height + element.clientHeight,
        width: element.clientWidth
      })
    }

  }

  console.log("arr", arr)
  // 创建dom
  for (let index = 0; index < arr.length; index++) {
    var dom = document.createElement('p')
    dom.className = "cxy1"
    dom.innerHTML = "备注:cxy"
    dom.style.position = "absolute"

    dom.style.left = 100 + "px"
    dom.style.top = arr[index].height - 200 + "px"


    box.appendChild(dom)
    // 创建dom end
  }

}

