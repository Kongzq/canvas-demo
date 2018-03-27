var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var lineWidth = 5

autoSetCanvasSize(canvas)

listenToUser(canvas)


var eraserEnabled = false
pen.onclick = function(){
  eraserEnabled = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}
eraser.onclick = function(){
  eraserEnabled = true
  eraser.classList.add('active')
  pen.classList.remove('active')
}
clear.onclick = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// 这种保存为图片的方法有兼容性问题，在ios chrome上点击按钮不会下载图片，
//而是直接打开url变量的地址，在小米6的miui9 chrome则正常
download.onclick = function(){
  var url = canvas.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = '我的画'
  a.target = '_blank'
  a.click()
}


red.onclick = function(){
  context.fillStyle = 'red'
  context.strokeStyle = 'red'
  red.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
green.onclick = function(){
  context.fillStyle = 'green'
  context.strokeStyle = 'green'
  red.classList.remove('active')
  green.classList.add('active')
  blue.classList.remove('active')
}
blue.onclick = function(){
  context.fillStyle = 'blue'
  context.strokeStyle = 'blue'
  red.classList.remove('active')
  green.classList.remove('active')
  blue.classList.add('active')
}

thin.onclick = function(){
  lineWidth = 5
 
  thick.classList.remove('active')
  thin.classList.add('active')
}
thick.onclick = function(){
  lineWidth = 10
  thin.classList.remove('active')
  thick.classList.add('active')
}

/******/

function autoSetCanvasSize(canvas) {
  setCanvasSize()

  window.onresize = function() {
    setCanvasSize()
    //todo:，resize后用户之前画好的东西会消失
  }

  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight

    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill()
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1) 
  context.lineWidth = lineWidth
  context.lineTo(x2, y2) 
  context.stroke()
  context.closePath()
}

function listenToUser(canvas) {


  var using = false
  var lastPoint = {
    x: undefined,
    y: undefined
  }
  // 特性检测
  if(document.body.ontouchstart !== undefined){
    // 在pc上document.body.ontouchstart是undefined，表明不支持该事件，而在触屏设备上是null，支持该事件
    canvas.ontouchstart = function(e){
      var x = e.touches[0].clientX  
   // 把event打印出来就可以看到，因为手机支持多点触控，所以关于touch的信息都放在一个数组里，touches[0]表示一点触控，tounch[1]表示另外一点触控
      var y = e.touches[0].clientY
      console.log(x,y)
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
      }
    }
    canvas.ontouchmove = function(e){
      console.log('边摸边动')
      var x = e.touches[0].clientX
      var y = e.touches[0].clientY

      if (!using) {return}

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function(){
      console.log('摸完了')
      using = false
    }
  }else{
    // 非触屏设备
    canvas.onmousedown = function(e) {
      var x = e.clientX
      var y = e.clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = {
          "x": x,
          "y": y
        }
      }
    }
    canvas.onmousemove = function(e) {
      var x = e.clientX
      var y = e.clientY

      if (!using) {return}

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
        
        // 这里-5的意义是调整rect的正中心到鼠标的左上角，这样橡皮擦更能随鼠标移动准确擦除线条，
        // using这个变量的作用就是用户点击橡皮擦或画笔那个按钮后，一般的交互都是用户单击鼠标后，再移动鼠标擦除或画线，
        // 所以在onmousedown时 using = true，如果没有这个using判定，用户移动鼠标自动擦除或画线了
      } else {
        var newPoint = {
          "x": x,
          "y": y
        }
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }

    }
    canvas.onmouseup = function(e) {
      using = false
    }
  }

}
