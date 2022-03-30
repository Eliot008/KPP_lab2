var colors = require('colors'); // https://www.npmjs.com/package/colors
var blessed = require("blessed"); // https://www.npmjs.com/package/blessed


function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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

    clear() { // ?????
      main_field_box.setContent("");
      screen.render();
    }

    

    mix(){
      for(var i = 0; i< this.#height; i++){
        for(var j = 0; j< this.#width; j++){
          this.#arr_current[i][j] = random(0, 3);
            if(this.#arr_current[i][j] == 1) this.#arr_current[i][j] = 1;
            else this.#arr_current[i][j] = 0;
        }
      }
    }
    
    cout_arr(){
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


 }

 var screen = blessed.screen({
  smartCSR: true,
});



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


var button_1 = blessed.button({
  parent: form_1,
  mouse: true,
  keys: true,
  shrink: true,
  top: "5%",
  left: "5%",
  width: "20%",
  height: "10%",
  name: "cancel",
  tags: true,
  content: "Fill",
  style: {
    bg: "#FFF830",
    fg: "black",
    focus: {
      bg: "blue",
    },
  },
});


var label_1 = blessed.text({
  parent: form_1,
  top: "0%",
  left: "5%",
  width: "30%",
  height: "5%",
  colors: "black",
  inputOnFocus: true,
  content: "random",
  tags: true,
  style: {
    bg: "#48FFF3",
    fg: "black",
    focus: {
      bg: "blue",
    },
  },
});



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
});


// Screen
screen.append(main_field_box);
screen.append(form_1);
// Form
form_1.append(button_1);

form_1.append(label_1);


screen.title = "game";
var A = new field_completion(0, 0, 0); 
var id; // setInterval

screen.render();