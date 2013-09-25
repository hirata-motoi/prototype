var args = arguments[0] || {};
$.row.backgroundColor = args.bgcolor ? "#faf8f5" : "#eee4db";
$.title.text =  "Menu" + args.id;
$.image.image = "/image" + args.id + ".png";