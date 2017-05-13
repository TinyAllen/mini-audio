import './style.less';
class Audio {
  /**
   * option->
   * element：目标dom节点
   * autoplay:自动播放 true/false
   * menu:显示菜单 true/false
   * mode：模仿模式 1.列表循环 2.单曲循环 3.随机播放
   * path:音乐文件根目录
   * music:Array->{
   *  url
   *  title
   *  author
   *  img
   * }
   */
  constructor(option) {
    this.option = option;
    this.audioTimer = null;
    this.currentIndex = 0;
    let initOption = {
      element: document.getElementById('player'),
      autoplay: false,
      menu: false,
      mode: 0,
      path: "",
      music: []
    };
    for (let key in initOption) {
      if (initOption.hasOwnProperty(key) && !option.hasOwnProperty(key)) {
        option[key] = initOption[key];
      }
    }
  }
  /**
   * 渲染进dom
   */
  render() {
    let listStr = "";
    let menuBtn = ``;
    if (this.option.menu) {
      menuBtn = `<a class="audio-btn" id="audio-menu">${this.getIco('menu')}</a>`
      for (let i = 0; i <= this.option.music.length - 1; i++) {
        listStr += `
      <li class=${this.currentIndex == i ?"audio-list-active":""}>
        <span>${i + 1}</span>
        <span class="audio-list-title">${this.option.music[i].title}</span>
        <span class="audio-list-author">${this.option.music[i].author?this.option.music[i].author:""}</span>
      </li>`
      };
    }
    let eleHTML = `
    <div class="audio">
      <audio src='${this.option.path}/${this.option.music[0].url}'></audio>
      <div class="audio-img" style="background-image:url('${this.option.music[0].img}')"></div>
      <div class="audio-body">
        <div class="audio-title">${this.option.music[this.currentIndex].title} - ${this.option.music[this.currentIndex].author?this.option.music[this.currentIndex].author:""}</div>
        <div class="audio-control">
          <div id="progress" class="progress">
            <div id="outer-bar" class="outer-bar">
              <span id="inner-bar" class="inner-bar"></span>
            </div>
          </div>
          <a class="audio-btn" id="audio-pre">${this.getIco('pre')}</a>
          <a class="audio-btn" id="audio-play"></a>
          <a class="audio-btn" id="audio-next">${this.getIco('next')}</a>
          ${menuBtn}
          <a class="audio-btn" id="audio-mode">${this.getIco('mode')}</a>
        </div>
      </div>
      <ul id="audio-list" class="${this.option.menu?"audio-list":"audio-list-0"}">${listStr}</ul>
    </div>`;
    this.option.element.innerHTML = eleHTML;
    this.audio = document.getElementsByTagName("audio")[0];
    this.domPlay = document.getElementById('audio-play');
    this.domMode = document.getElementById("audio-mode");
    if (this.option.autoplay) {
      this.audio.play();
      this.progressRun();
      this.domPlay.innerHTML = this.getIco('pause');
    } else {
      this.domPlay.innerHTML = this.getIco('play');
    }
    this.listen();
    this.progressDrag("progress", "inner-bar");
  }
  /**
   * 返回图标
   */
  getIco(type) {
    const ico = {
      mode: 'M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031h-1.969v-6h12v-3l3.984 3.984-3.984 3.984v-3h-10.031z',
      menu: 'M3 6h18v2.016h-18v-2.016zM3 12.984v-1.969h18v1.969h-18zM3 18v-2.016h18v2.016h-18z',
      pre: 'M9.516 12l8.484-6v12zM6 6h2.016v12h-2.016v-12z',
      next: 'M15.984 6h2.016v12h-2.016v-12zM6 18v-12l8.484 6z',
      pause: 'M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z',
      play: 'M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z',
      repeat: 'M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031h-1.969v-6h12v-3l3.984 3.984-3.984 3.984v-3h-10.031z',
      repeat_one: 'M12.984 15h-1.5v-3.984h-1.5v-1.031l2.016-0.984h0.984v6zM17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031h-1.969v-6h12v-3l3.984 3.984-3.984 3.984v-3h-10.031z',
      shuffle: 'M14.813 13.406l3.141 3.141 2.063-2.063v5.531h-5.531l2.063-2.063-3.141-3.141zM14.484 3.984h5.531v5.531l-2.063-2.063-12.563 12.563-1.406-1.406 12.563-12.563zM10.594 9.188l-1.406 1.406-5.203-5.203 1.406-1.406z'
    }
    return `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path d="${ico[type]}"></path>
      </svg>`
  }
  listen() {
    this.audio.addEventListener('ended', () => {
      if (this.audio.currentTime) this.play(1);
    });
    document.getElementById('audio-list').addEventListener('click', (e) => {
      if (e.target.tagName.toUpperCase() === 'LI') {
        this.currentIndex = e.target.getElementsByTagName("span")[0].innerHTML - 1;
      } else {
        this.currentIndex = e.target.parentElement.getElementsByTagName("span")[0].innerHTML - 1;
      }
      this.music(this.currentIndex)
      this.domPlay.innerHTML = this.getIco('pause');
    });
    document.getElementById('audio-pre').addEventListener('click', this.play.bind(this, 0));
    document.getElementById('audio-next').addEventListener('click', this.play.bind(this, 1));
    this.domPlay.addEventListener('click', this.playPause.bind(this));
    this.domMode.addEventListener('click', this.mode.bind(this));
    if (this.option.menu)
      document.getElementById('audio-menu').addEventListener('click', this.toggle.bind(this));
  }
  /**
   * menu的显隐
   */
  toggle() {
    let menu = document.getElementById("audio-list");
    if (menu.offsetHeight == 0) {
      menu.style.height = "185px";
    } else {
      menu.style.height = 0;
    }
  }
  /**
   * 播放暂停二合一
   */
  playPause() {
    clearInterval(this.audioTimer);
    if (this.audio.paused) {
      this.audio.play();
      this.progressRun();
      this.domPlay.innerHTML = this.getIco('pause');
    } else {
      this.audio.pause();
      this.domPlay.innerHTML = this.getIco('play');
    }
  }
  /**
   * 进度条自运动
   */
  progressRun() {
    this.audioTimer = setInterval(() => {
      document.getElementById("inner-bar").style.width = this.audio.currentTime / this.audio.duration * 100 + "%";
    }, 200);
  }
  /**
   * 进度条拖动
   */
  progressDrag(outerEle, innerEle) {
    let progress = document.getElementById(outerEle);
    let inner = document.getElementById(innerEle);
    progress.addEventListener('mousedown', (e) => {
      clearInterval(this.audioTimer);
      let precent = (e.clientX - progress.offsetLeft) / progress.offsetWidth;
      inner.style.width = precent * 100 + "%";
      document.onmousemove = () => {
        let e = e || window.event;
        let precent = (e.clientX - progress.offsetLeft) / progress.offsetWidth;
        if (precent > 1) precent = 1;
        if (precent < 0) precent = 0;
        inner.style.width = precent * 100 + "%";
        document.onmouseup = () => {
          this.progressUp(precent);
        };
      };
      document.onmouseup = () => {
        this.progressUp(precent);
      };
    })
  }
  progressUp(precent) {
    this.audio.currentTime = this.audio.duration * precent;
    if (!this.audio.paused) this.progressRun();
    document.onmouseup = document.onmousemove = null;
  }
  /**
   * 不同模式播放
   * 1.列表循环 2.单曲循环 3.随机播放
   */
  play(state) {
    if (this.option.mode == 0) {
      if (state) {
        this.currentIndex == 0 ? this.currentIndex = this.option.music.length - 1 : this.currentIndex -= 1;
      } else {
        this.currentIndex == this.option.music.length - 1 ? this.currentIndex = 0 : this.currentIndex += 1
      }
      this.music(this.currentIndex);
    } else if (this.option.mode == 1) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.currentIndex = Math.round((this.option.music.length - 1) * Math.random());
      this.music(this.currentIndex);
    }
    this.domPlay.innerHTML = this.getIco('pause');
  }
  /**
   * 音乐切换
   */
  music(index) {
    clearInterval(this.audioTimer);
    let listBox = document.getElementById('audio-list');
    listBox.getElementsByClassName('audio-list-active')[0].classList.remove('audio-list-active');
    document.getElementsByClassName("audio-img")[0].style.backgroundImage = "url(" + this.option.music[index].img + ")";
    document.getElementsByClassName('audio-title')[0].innerHTML = this.option.music[index].title + " - " + this.option.music[index].author;
    listBox.getElementsByTagName('li')[index].classList.add("audio-list-active");
    this.audio.src = this.option.path + "/" + this.option.music[index].url;
    this.audio.play();
    this.progressRun();
  }
  /**
   * 模式转换
   */
  mode() {
    if (this.option.mode == 2) {
      this.option.mode = 0;
      this.domMode.innerHTML = this.getIco('repeat');
    } else if (this.option.mode == 0) {
      this.option.mode += 1;
      this.domMode.innerHTML = this.getIco('repeat_one');
    } else {
      this.option.mode += 1;
      this.domMode.innerHTML = this.getIco('shuffle');
    }
  }
   /**
   * 组件销毁及状态清空
   */
  destory() {
    this.audio.pause();
    clearInterval(this.audioTimer);
    this.option.element.innerHTML = '';
    for (let key in this) {
      if (this.hasOwnProperty(key)) delete this[key];
    }
  }
}

module.exports = Audio;