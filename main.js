var colors = require('colors'); // https://www.npmjs.com/package/colors
var blessed = require("blessed"); // https://www.npmjs.com/package/blessed


function random(min, max) { // Рандом лоігійка для майбутнього заповнення
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум і мінімум включається
}

 class field_completion{
  #height;
  #width;
  #arr_current;
  #arr_old;
  constructor(height, width) {
      this.#height = height;
      this.#width = width;
      this.#arr_current = new Array(height);
      this.#arr_old = new Array(height);
      for (var i = 0; i < height; i++) {
        this.#arr_current[i] = new Array(width);
        this.#arr_old[i] = new Array(width);
      }
      this.mix();
    }

    clear() { // Очищення для динамічного відображення
      main_field_box.setContent("");
      screen.render();
    }

    

    mix(){ // Заповнення поля + статичні фігури
      for(var i = 0; i< this.#height; i++){
        for(var j = 0; j< this.#width; j++){
          this.#arr_current[i][j] = random(0, 3);
            if(this.#arr_current[i][j] == 1) this.#arr_current[i][j] = 1;
            else this.#arr_current[i][j] = 0;

            //квадрат1 статична фігура
            this.#arr_current[1][1] = 1;
            this.#arr_current[1][2] = 1;
            this.#arr_current[2][1] = 1;
            this.#arr_current[2][2] = 1;

            //квадрат2 статична фігура
            this.#arr_current[13][13] = 1;
            this.#arr_current[13][14] = 1;
            this.#arr_current[14][13] = 1;
            this.#arr_current[14][14] = 1;
        }
      }
    }
  
    cout_arr(){ // Виведення клітинок
      this.clear();
      for (var i = 0; i < this.#height; i++) {
        for (var j = 0; j < this.#width; j++) {
          if (this.#arr_current[i][j] == 1) {
            // alive
            main_field_box.setContent(main_field_box.content + "  ".bgGreen);
          }
          else {
            //dead
              main_field_box.setContent(main_field_box.content + "  ");
          }
        }
        main_field_box.setContent(main_field_box.content + "\n");
      }
      screen.render();
    }

    #check(n, m) { // Перевіряємо чи правильна кордината
      if (n >= 0 && n < this.#height && m >= 0 && m < this.#width) {
        return true;
      }
      return false;
    }

    #define_point(height, width) { // Логійка життя(правила)
      //квадрат1 статична фігура
      this.#arr_current[1][1] = 1;
      this.#arr_current[1][2] = 1;
      this.#arr_current[2][1] = 1;
      this.#arr_current[2][2] = 1;

      //квадрат2 статична фігура
      this.#arr_current[13][13] = 1;
      this.#arr_current[13][14] = 1;
      this.#arr_current[14][13] = 1;
      this.#arr_current[14][14] = 1;

      var result = 0;
      // по часові з -1 -1
      // [-1][-1] [-1][0] [-1][+1]
      //  [0][-1] [0][0]  [0][+1]
      // [+1][-1] [+1][0] [+1][+1]
      var height_1 = [
        height - 1,
        height - 1,
        height - 1,
        height,
        height + 1,
        height + 1,
        height + 1,
        height,
      ];
      var width_1 = [
        width - 1,
        width,
        width + 1,
        width + 1,
        width + 1,
        width,
        width - 1,
        width - 1,
      ];
  
      for (var i = 0; i < 8 && this.#check(height_1[i], width_1[i]); i++) {
        result += this.#arr_current[height_1[i]][width_1[i]];
      }
  
      if (this.#arr_current[height][width] == 1 && result <= 1) {
        return 0;
      } else if (this.#arr_current[height][width] == 0 && result == 3) {
        return 1;
      } else if (this.#arr_current[height][width] == 1 && result >= 4) {
        return 0;
      } else if (
        this.#arr_current[height][width] == 1 &&
        (result == 2 || result == 3)
      ) {
        return 1;
      } else {
        return 0;
      }
      
    }

    update_field() {  
      var arr_temp = Object.assign([], this.#arr_current);
      for (var i = 0; i < this.#height; i++) {
        for (var j = 0; j < this.#width; j++) {
          arr_temp[i][j] = this.#define_point(i, j);
        }
      }
      this.#arr_current = Object.assign([], arr_temp);
    }

 }

 var screen = blessed.screen({
  smartCSR: true,
});

//Добавляжмо елементи
 var main_field_box = blessed.box({
  top: "center",
  left: "left",
  width: "70%",
  height: "95%",
  tags: true,
  style: {
    bg: "black",
  },
});
var form_1 = blessed.form({
  parent: screen,
  keys: true,
  top: "5%",
  left: "70%",
  width: "30%",
  height: "95%",
  tags: true,
  style: {
    bg: "red",
  },
});
var label_1 = blessed.text({
  parent: form_1,
  top: "5%",
  left: "40%",
  width: "30%",
  height: "5%",
  colors: "black",
  inputOnFocus: true,
  content: "Game of life",
  tags: true,
  style: {
    bg: "yellow",
    fg: "red",
    focus: {
      bg: "blue",
    },
  },
});
var button_1 = blessed.button({
  parent: form_1,
  mouse: true,
  keys: true,
  shrink: true,
  top: "20%",
  left: "45%",
  width: "24%",
  height: "10%",
  name: "cancel",
  tags: true,
  content: "Field generation",
  style: {
    bg: "#FFF830",
    fg: "black",
    focus: {
      bg: "green",
    },
  },
});
var button_2 = blessed.button({
  top: "35%",
  left: "45%",
  width: "24%",
  height: "10%",
  inputOnFocus: true,
  tags: true,
  content: "Stop",
  style: {
    bg: "#gray", // bg: "#FFF830",
    fg: "#ffffff",   // fg: "black",
    focus: {
      bg: "green", // bg: "green",
    },
  },
});
var button_3 = blessed.button({
  top: "50%",
  left: "45%",
  width: "24%",
  height: "10%",
  inputOnFocus: true,
  tags: true,
  content: "Start",
  style: {
    bg: "gray", // bg: "#FFF830",
    fg: "#ffffff",   // fg: "black",
    focus: {
      bg: "green", // bg: "green",
    },
  },
});

var input_1 = blessed.textarea({
  parent: form_1,
  top: '13%',
  left: '42%',
  width: '25%',
  height: '5%',
  colors: 'black',
  inputOnFocus: true,
  content: '3',
  tags: true,
  style: {
      bg: 'white',
      fg: 'black',
      focus: {
          bg: 'blue'
        }   
  }
});

// Quit on Escape, q, or Control-C.
screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});
// action buttons
button_1.on("press", function () {
  //fill
  A = new field_completion(
    parseInt(main_field_box.height),
    parseInt(main_field_box.width / 2)
  );
  A.cout_arr();
  button_2.style.bg="#FFF830";
  button_2.style.fg="black";

  button_3.style.bg="#FFF830";
  button_3.style.fg="black";
});
button_2.on("press", function () {
  //stop
  clearInterval(id);
  screen.render();
});
button_3.on("press", function () {
  //start
  if (input_1.value==1) speed=3000;
  else if (input_1.value==2) speed=2000;
  else if (input_1.value==3) speed=1000;
  if (input_1.value=='') speed=3000;

  id = setInterval(() => {
    A.update_field();
    A.cout_arr();
  }, speed);
});


// Screen
screen.append(main_field_box);
screen.append(form_1);
// Form
form_1.append(label_1);
form_1.append(button_1);
form_1.append(button_2);
form_1.append(button_3);
form_1.append(input_1);


screen.title = "Game of life";
var A = new field_completion(0, 0, 0); 
var id; // setInterval 100- 1x 50 - 2x 10 - 4x

screen.render();
