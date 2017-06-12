![2](https://user-images.githubusercontent.com/19775780/27030857-6a5f128c-4fa0-11e7-830a-8dc26099f238.JPG)

> 🎶 An audio player made with javascript

<br/>

## Introduction.
 
[Docs](https://tinyallen.github.io/mini-audio/)

## Install.
[Download .zip](https://tinyallen.github.io/mini-audio/data/audio.zip)

## Usage.

1. Include the **audio.js** file

```html
<div id="player"></div>
<script src="audio.js"></script>
```
2. Initialise the audio player

```javascript
var audio = new Audio({
    element: document.getElementById('player'),  //渲染的mod节点，默认是 #player
    autoplay: true,                              //是否自动播放,默认false
    menu: true,                                  //是否显示菜单
    path: "",                                    //音频文件根目录，模式是root
    music: [{
      url: "",                                   //音乐的Url地址
      title: "",                                 //音乐标题
      author: "",                                //歌手
      img: ""                                    //音乐图片
    }]
});
```

3. Render the audio player

```javascript
audio.render();
```

##
