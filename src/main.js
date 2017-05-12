import './main.css';
class Audio {
  constructor(option) {
    this.name = name;
    this.option = option;
    this.audioTimer = null;
    this.currentIndex = 0;

    let initOption = {
      element: document.getElementById('player'),
      autoplay: false,
      menu: false,
      music: [],
      mode: 0
    };

    for (let key in initOption) {
      if (initOption.hasOwnProperty(key) && !option.hasOwnProperty(key)) {
        option[key] = initOption[key];
      }
    }
    this.render();
    this.listen();
    this.progressDrag("progress", "inner-bar");

  }
  render() {
    let listStr = "";
    let isActive = 0;
    let menuBtn = ``;
    if (this.option.menu) {
      menuBtn = `<a class="mplayer-btn" id="mplayer-menu">${this.getIco('menu')}</a>`
      for (let i = 0; i <= this.option.music.length - 1; i++) {
        this.currentIndex == i ? isActive = 1 : isActive = 0;
        listStr += `
      <li class=${isActive?"mplayer-list-active":""}>
        <span>${i + 1}</span>
        <span class="mplayer-list-title">${this.option.music[i].title}</span>
        <span class="mplayer-list-author">${this.option.music[i].author?this.option.music[i].author:""}</span>
      </li>`
      };
    }
    let eleHTML = `
    <div class="mplayer">
      <audio src='${this.option.path}/${this.option.music[0].url}'></audio>
      <div class="mplayer-img" style="background-image:url('${this.option.music[0].img}')"></div>
      <div class="mplayer-body">
        <div class="mplayer-title">${this.option.music[this.currentIndex].title} - ${this.option.music[this.currentIndex].author?this.option.music[this.currentIndex].author:""}</div>
        <div class="mplayer-control">
          <div id="progress" class="progress">
            <div id="outer-bar" class="outer-bar">
              <span id="inner-bar" class="inner-bar"></span>
            </div>
          </div>
          <a class="mplayer-btn" id="mplayer-pre">${this.getIco('pre')}</a>
          <a class="mplayer-btn" id="mplayer-play"></a>
          <a class="mplayer-btn" id="mplayer-next">${this.getIco('next')}</a>
          ${menuBtn}
          <a class="mplayer-btn" id="mplayer-mode">${this.getIco('mode')}</a>
        </div>
      </div>
      <ul id="mplayer-list-box" class="${this.option.menu?"mplayer-list-box":"mplayer-list-box-0"}">${listStr}</ul>
    </div>`;
    this.option.element.innerHTML = eleHTML;
    this.audio = document.getElementsByTagName("audio")[0];
    if (this.option.autoplay) {
      this.audio.play();
       this.progressRun();
      document.getElementById('mplayer-play').innerHTML = this.getIco('pause');
    } else {
      document.getElementById('mplayer-play').innerHTML = this.getIco('play');
    }
  }
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
        <path d="${ico[type]}">
        </path>
      </svg>`
  }
  listen() {
    this.audio.addEventListener('ended', () => {
      if (this.audio.currentTime) this.musicPlay(1);
    });
    document.getElementById('mplayer-list-box').addEventListener('click', (e) => {
      var target = null;
      if (e.target.tagName.toUpperCase() === 'LI') {
        target = e.target;
      } else {
        target = e.target.parentElement;
      }
      this.currentIndex = target.getElementsByTagName("span")[0].innerHTML - 1;
      this.setMusic(this.currentIndex)
      document.getElementById('mplayer-play').innerHTML = this.getIco('pause');
    });
    document.getElementById('mplayer-play').addEventListener('click', this.playPause.bind(this));
    document.getElementById('mplayer-pre').addEventListener('click', this.musicPlay.bind(this, 0));
    document.getElementById('mplayer-next').addEventListener('click', this.musicPlay.bind(this, 1));
    document.getElementById('mplayer-mode').addEventListener('click', this.changeMode.bind(this));
    if (this.option.menu)
      document.getElementById('mplayer-menu').addEventListener('click', this.showMenu.bind(this));
  }
  showMenu() {
    var menu = document.getElementById("mplayer-list-box");
    if (menu.offsetHeight == 0) {
      menu.style.height = "185px";
    } else {
      menu.style.height = 0;
    }
  }
  playPause() {
    let play = document.getElementById('mplayer-play');
    if (this.audio.paused) {
      this.audio.play();
      this.progressRun();
      play.innerHTML = this.getIco('pause');
    } else {
      this.audio.pause();
      clearInterval(this.audioTimer);
      play.innerHTML = this.getIco('play');
    }
  }
  progressRun() {
    this.audioTimer = setInterval(() => {
      document.getElementById("inner-bar").style.width = this.audio.currentTime / this.audio.duration * 100 + "%";
    }, 100);
  }
  progressDrag(outerEle, innerEle) {
    let progress = document.getElementById(outerEle);
    let inner = document.getElementById(innerEle);
    progress.addEventListener('mousedown', (e) => {
      var precent = (e.clientX - progress.offsetLeft) / progress.offsetWidth;
      inner.style.width = precent * 100 + "%";
      clearInterval(this.audioTimer);
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
    this.update(precent);
    if (!this.audio.paused) this.progressRun();
    document.onmouseup = null;
    document.onmousemove = null;
  }
  update(precent) {
    this.audio.currentTime = this.audio.duration * precent;
  }
  musicPlay(state) {
    if (this.option.mode == 0) {
      if (state) {
        this.currentIndex == 0 ? this.currentIndex = this.option.music.length - 1 : this.currentIndex -= 1;
      } else {
        this.currentIndex == this.option.music.length - 1 ? this.currentIndex = 0 : this.currentIndex += 1
      }
      this.setMusic(this.currentIndex);
    } else if (this.option.mode == 1) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.currentIndex = Math.round((this.option.music.length - 1) * Math.random());
      this.setMusic(this.currentIndex);
    }
    clearInterval(this.audioTimer);
    this.progressRun();
    document.getElementById('mplayer-play').innerHTML = this.getIco('pause');
  }
  setMusic(index) {
    
    let listBox = document.getElementById('mplayer-list-box');
    if (listBox.getElementsByClassName('mplayer-list-active')[0]) {
      listBox.getElementsByClassName('mplayer-list-active')[0].classList.remove('mplayer-list-active');
    }
    document.getElementsByClassName("mplayer-img")[0].style.backgroundImage="url("+this.option.music[index].img+")";
    document.getElementsByClassName('mplayer-title')[0].innerHTML = this.option.music[index].title + " - " + this.option.music[index].author;
    listBox.getElementsByTagName('li')[index].classList.add("mplayer-list-active");
    this.audio.src = this.option.path + "/" + this.option.music[index].url;
    this.audio.play();
    clearInterval(this.audioTimer);
    this.progressRun();
  }
  changeMode() {
    let mode = document.getElementById("mplayer-mode");
    if (this.option.mode == 2) {
      this.option.mode = 0;
      mode.innerHTML = this.getIco('repeat');
    } else if (this.option.mode == 0) {
      this.option.mode += 1;
      mode.innerHTML = this.getIco('repeat_one');
    } else {
      this.option.mode += 1;
      mode.innerHTML = this.getIco('shuffle');
    }
  }
}

module.exports = Audio;